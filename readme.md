
# Hologram Media Generator

スマホでホログラム動画/写真を作るためのWebアプリ。LLM不使用(デバッグは頼った)の温かみのある手書きコードです。デザインパターン学習用に無理に各パターンを詰め込んであります。

- 画像 / 動画アップロード
- ホログラム表示(filter)

[![My Skills](https://skillicons.dev/icons?i=nestjs,react,postgres,vercel,supabase,docker,nginx,linux,ubuntu,git,github,typescript,html,css,tailwind,md,pnpm,powershell,vscode)](https://skillicons.dev)
---
## Design Pattern Usage
|pattern|purpose|file|
|---|---|---|
|Memento|表示のカスタム機能|https://github.com/shu-hi/react/blob/main/my-app/src/app/holo/fileComponents.tsx
|Strategy|ダークモード実装時の拡張用|https://github.com/shu-hi/nest-back/blob/main/my-app/src/services/holoClass.ts
|Command||統合作業中
|Composite|動画と写真をmediaとしてまとめて扱う|https://github.com/shu-hi/nest-back/blob/main/my-app/src/services/holoClass.ts
|Abstract Factory|写真/動画で使う材料(クラス)をまとめて生成|https://github.com/shu-hi/react/blob/main/my-app/src/app/holo/showHolo.ts
|Observer|apiから取れたら通知して描画する|https://github.com/shu-hi/react/blob/main/my-app/src/app/holo/showHolo.ts
|Proxy|いろいろ。|開発ではnginx使ってたりもする。
|Simple Factory|写真と動画の分岐を隠蔽してクラス作成|https://github.com/shu-hi/nest-back/blob/main/my-app/src/services/holoClass.ts
|Bridge|汚い型を委譲できれいに|https://github.com/shu-hi/react/blob/main/my-app/src/app/holo/UploadComponents.tsx
|Adapter|動画のinterfaceに写真/動画両方の機能を付けるadapter|https://github.com/shu-hi/react/blob/main/my-app/src/app/holo/UploadComponents.tsx

---
## 本番

```mermaid
architecture-beta
    group client[client]
    group vercel[vercel]
    group render[render]
    group docker[docker] in render
    group supabase[supabase]
    
    service user[user] in client
    service react[react] in vercel
    service NestJS[NestJS] in docker
    service rdbms(database)[postgres] in supabase
    service bucket(disk)[storage] in supabase
    
    user:B --> T:react
    react:R --> L:NestJS
    NestJS:T --> B:rdbms
    NestJS:T --> B:bucket
```
## 開発
```mermaid
architecture-beta
    group client[client]
    group wsl[wsl]
    group docker[docker] in wsl
    group supabase[supabase]
    
    service user[user] in client
    service react[react] in docker
    service nginx[nginx] in docker
    service NestJS[NestJS] in wsl
    service rdbms(database)[postgres] in supabase
    service bucket(disk)[storage] in supabase
    
    user:B --> T:nginx
    react:R --> L:NestJS
    nginx:R --> L:react
    NestJS:T --> B:rdbms
    NestJS:T --> B:bucket
```
---
```mermaid
classDiagram
    class holoMedia{
        -_isReady:string
        -_subscribers: Observer[]
        -hash: string
        -_media_type:number
        +async getMediaReady() void
        +subscribe(observer: Observer) void
        +unsubscribe(observer: Observer) void
        - notify(message: string) void
        -async holoMediaAPIRes() Promise<string>
    }
    class Observer{
        <<interface>>
        +update(url: string): void
    }
    class holoHandler{
        +update(url:string) void
    }
    class layerHandler{
        +update(url:string) void
    }
    Observer <|-- holoHandler :implement
    Observer <|-- layerHandler :implement
    class showHandlerFactory{
        <<interface>>
        +holoUpdater() Observer
        +layerUpdater() Observer
    }
    class defaultShowHandlerFactory{
        +holoUpdater() Observer
        +layerUpdater() Observer
    }
    class darkShowHandlerFactory{
        +holoUpdater() Observer
        +layerUpdater() Observer
    }
    showHandlerFactory <|-- defaultShowHandlerFactory : implement
    showHandlerFactory <|-- darkShowHandlerFactory : implement
```

---
```mermaid

classDiagram
    class uploadVideoComponent{
        -VideoUploader: React.FC<uploadprops>
        +getComponent():React.FC<uploadprops>
    }
    class uploadAdapter {
        -PicturesUploader: React.FC<uploadprops2>
        +getComponent():React.FC<uploadprops>
    }
    class mediaFilter{
        -monochro:boolean
        -bluenize:boolean
        -scanline:boolean
        +changeState(monochro:boolean,bluenize:boolean,scanline:boolean) void
        +save(): Memento
        +display():string[]
        +restore(memento:mediaMemento):void
    }
    class Memento{
        <<interface>>
        +getMonochro():boolean
        +getBluenize():boolean
        +getScanline():boolean
    }
    class mediaMemento{
        -monochro:boolean
        -bluenize:boolean
        -scanline:boolean
        +getMonochro():boolean
        +getBluenize():boolean
        +getScanline():boolean
    }
    class CareTaker{
    -scenes:[name:string]:Memento
    -mediaFilter:mediaFilter
    +backup(name:string):void
    +restore(name:string):void
    +get(name:string):Memento | undefined
    }
    Memento <|-- mediaMemento : implement

```

---
/holo
ホログラムをスマホで作ってみよう……のフロント側。

holoMediaと(holo|layer)HandlerはObserver patternで実装している。  
mediaを取ってくる処理が終わったらholoHandler,layerHandlerに通知され、処理が動く。
reactではuseStateがあるので正直不要というか使わないほうが良いのでは……

showHandlerFactoryと(dark|default)ShowHandlerFactoryはabstract factory patternを想定している。showhandlerを作る際に、layerとholoをそれぞれ作って使うのでfactory内で一括でやらせている。

Uploadcomponents。adopter patternのために書いた今回の魔境。動画のみだったところ(uploadVideoComponent)に写真も追加する仕様が降ってきた(uploadAdapter)想定で書いたが、この規模や状態だと書き直すか、適当なラッパーで吸収したほうが一億倍安定・早い・楽。練習にしてもapi側とかのほうが良かった。型について一部delegation patternのようなものを実装している。

filterComponents。表示のカスタムと保存のためにmemento　patternを採用した。
reactのrenderのタイミングのため、素直な実装ではなくrefを通している。これもreactだと使わなくていいパターンな気がする。

---

memo

sudo apt update  
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -  
sudo apt install nodejs -y  
npm install -g create-react-app  
npm install dotenv  
myenv上のmy-app下で nohup npm run dev -- -H 0.0.0.0 -p 4000 > react.log 2>&1 &  
~~nginx-reactを同ディレクトリでdocker-compose up --build -d   
これ用のconfで立ち上がる~~→localでは使わない、prodでも使わない。

バックエンドはfastapi(pandas)->githubのsnippet  
と、NestJS->githubのnestjs

使っているのは
react:vercel
fastapi/NestJS:render
postgres:supabase
keepalive:UptimeRobot

---
