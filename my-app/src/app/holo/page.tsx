"use client"
import React, { useState } from "react";
import axios from "axios";
import {holoMedia,defauldShowHandlerFactory,darkShowHandlerFactory} from "showHolo";
import SpinnerOverlay from './SpinnerOverlay';
function App() {
  // CSVファイルを保持する状態
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'input'|'show'|'upload'>("input");
  const [mediaUrl,setMediaUrl]=useState('');
  const [mediaLayer,setLayer]=useState(false);
  const [spinner, setSpinner] = useState(false);
  const [hash, setHash] = useState('');
  const handleSubmit = async () => {
    setSpinner(true);
    const media=new holoMedia(hash);
    const defaultShowHandler=new defaultShowHandlerFactory(setMediaUrl,setLayer);
    media.subscribe(defaultShowHandler.holoUpdater());
    media.subscribe(defaultShowHandler.layerUpdater());
    media.getMediaReady();//observer pattern を無理に使ったのでlayer,urlの処理が見えなくなってしまった。reactとは相性が悪いかもしれない
    setSpinner(false);
  };
  return (
    <div className="App">
      {type=='input'&&(
        <div>input</div>
      )}
      {type=='show'&&(
        <div>show</div>
      )}
      {type=='upload'&&(
        <div>upload</div>
      )}
    </div>
  );
}

export default App;
