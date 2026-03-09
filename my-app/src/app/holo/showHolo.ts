import { VideoHTMLAttributes } from "react";

//observer pattern...reactではsetStateでよいですね
export interface Observer {
  update(url: string): void;
}
export class holoMedia{
    private _isReady:string = '';
    private readonly _subscribers: Observer[] = [];
    private readonly hash: string;

    constructor(hash: string) {
        this.hash = hash;
    }
    get isReady():string{
        return this._isReady;
    }
    async getMediaReady(){
        this._isReady=await this.holoMediaAPIRes();
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
            const res=await fetch(`${NEXT_PUBLIC_API_BASE_URL}/show/${this.hash}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                throw new Error("show request failed");
            }
            const data: ShowApiResponse = await res.json();
            if(data&&data.status=='ok'&&data.data){
                return data.data;
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
  status: string;
  data: string;
  err: string | null;
};

class holoHandler implements Observer{
    constructor(
        private setMediaURL: (url: string) => void
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
        private setLayer:(v:boolean)=>void
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
        private setLayer:(v:boolean)=>void
    ){}
    holoUpdater(): Observer {
        return new holoHandler(this.setMediaURL);
    }
    layerUpdater(): Observer {
        return new layerHandler(this.setLayer);
    }
}