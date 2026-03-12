import { VideoHTMLAttributes } from "react";

//observer pattern...reactではsetStateでよいですね
export interface Observer {
  update(url: string): void;
}
export class holoMedia{
    private _isReady:string = '';
    private readonly _subscribers: Observer[] = [];
    private readonly hash: string;
    private _media_type:number=0;
    constructor(hash: string) {
        this.hash = hash;
    }
    get isReady():string{
        return this._isReady;
    }
    get mediaType():number{
        return this._media_type;
    }
    async getMediaReady(){
        this._isReady=await this.holoMediaAPIRes();
        console.log(this._isReady);
        this.notify(this._isReady);
    }
    subscribe(observer: Observer): void {
        this._subscribers.push(observer);
    }
    
    unsubscribe(observer: Observer): void {
        const index = this._subscribers.indexOf(observer);
        if (index >= 0) {
        this._subscribers.splice(index, 1);
        }
    }
    
    private notify(message: string): void {
        for (const subscriber of this._subscribers) {
        subscriber.update(message);
        }
    }
    private async holoMediaAPIRes():Promise<string>{
        try{
            const res=await fetch(`${process.env.NEXT_PUBLIC_NEST_API_BASE_URL}/show/${this.hash}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                throw new Error("show request failed");
            }
            const data: ShowApiResponse = await res.json();
            console.log(data);
            if(data&&typeof data.url === 'string' && typeof data.media_type === 'number'){
                this._media_type=data.media_type;
                return data.url;
            }else{
                throw new Error("show request status failed");
            }
            
        }catch (err:unknown) {
            if (err instanceof Error) {
                return err.message;
            }
            return "unknown error";
        }
    }
}
type ShowApiResponse = {
  media_type:string;
  url:string;
};

class holoHandler implements Observer{
    constructor(
        private setMediaURL: (url: string) => void,
    ){}
    update(url:string):void{
        this.setMediaURL(url);//これは完全にsetStateでよいでしょう……
    }
}
class layerHandler implements Observer{
    constructor(
        private setLayer:(v:boolean)=>void
    ){}
    update(url:string):void{
        this.setLayer(false);
    }
}
//--------------------------------------------------------------------------------------------
//abstract factory pattern
interface showHandlerFactory{//例えばダークモードがあるとして、どちらにもlayerやholoを作る必要がある
    holoUpdater():Observer;
    layerUpdater():Observer;
}
export class defaultShowHandlerFactory implements showHandlerFactory{
    constructor(
        private setMediaURL:(url:string)=>void,
        private setLayer:(v:boolean)=>void,
    ){}
    holoUpdater(): Observer {
        return new holoHandler(this.setMediaURL);
    }
    layerUpdater(): Observer {
        return new layerHandler(this.setLayer);
    }
}
export class darkShowHandlerFactory implements showHandlerFactory{
    constructor(
        private setMediaURL:(url:string)=>void,
        private setLayer:(v:boolean)=>void,
    ){}
    holoUpdater(): Observer {
        return new holoHandler(this.setMediaURL);
    }
    layerUpdater(): Observer {
        return new layerHandler(this.setLayer);
    }
}
