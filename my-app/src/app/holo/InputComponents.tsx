import {holoMedia,defaultShowHandlerFactory,darkShowHandlerFactory} from "./showHolo";
interface InputProps {
  setHash: (arg0:string) => void;
  setSpinner: (arg0: boolean) => void;
  setMediaUrl:(arg0:string)=>void;
  setLayer:(arg0:boolean)=>void;
  setType: (arg0:'input'|'showv'|'showp'|'upload') => void;
  hash:string;
}

const InputComponents = ({setHash,setSpinner,setMediaUrl,setLayer,setType,hash}:InputProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSpinner(true);
      const media=new holoMedia(hash);
      const defaultShowHandler=new defaultShowHandlerFactory(setMediaUrl,setLayer);
      media.subscribe(defaultShowHandler.holoUpdater());
      media.subscribe(defaultShowHandler.layerUpdater());
      await media.getMediaReady();//observer pattern を無理に使ったのでlayer,urlの更新処理が見えなくなってしまった。reactとは相性が悪いかもしれない
      switch(media.mediaType){
        case 1:
          setType('showp');
          break;
        case 2:
          setType('showv');
          break;
        default:
          setType('input');
          break;
      }
      setSpinner(false);
    };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          {'press ↑(make and share)\n to register videos/pictures to share.'}
          <br />
          {'insert code and press "show" to see shared/made hologram↓'}
          <input
            type="text"
            placeholder="code"
            className="w-full p-2 mb-6 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
            show
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputComponents;
