"use client"
import React, { useState,useRef } from "react";
import axios from "axios";
import InputComponents from "./InputComponents";
import UploadComponents from "./UploadComponents";
import SpinnerOverlay from './SpinnerOverlay';
import FilterComponents from './filterComponents';
import './filter.css';
type files={
  r:File|null;
  l:File|null;
  u:File|null;
  d:File|null;
  v:File|null;
}
function App() {
  // ファイルを保持する状態
  const [file, setFile] = useState<files>({
    r: null,
    l: null,
    u: null,
    d: null,
    v: null
  });
  const [type, setType] = useState<'input'|'showv'|'showp'|'upload'>("upload");
  const [mediaUrl,setMediaUrl]=useState('');
  const [mediaLayer,setLayer]=useState(false);
  const [spinner, setSpinner] = useState(false);
  const [hash, setHash] = useState('');
  const [filter,setFilter]=useState(['','none']);
  const [cboxes,setCboxes]=useState<boolean[]>([false,false,false])
  const inputRefs : Record<keyof files, React.RefObject<HTMLInputElement|null>>= {
    u: useRef<HTMLInputElement>(null),
    r: useRef<HTMLInputElement>(null),
    d: useRef<HTMLInputElement>(null),
    l: useRef<HTMLInputElement>(null),
    v: useRef<HTMLInputElement>(null)
  }
  const [source, setSource] = useState('');
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>,key: keyof files) => {
    const onefile = e.target.files?.[0];
    if (!onefile) return;
    setFile(prev=>({...prev,[key]:onefile}));
    if (key === "v") {
    const url = URL.createObjectURL(onefile);
    setSource(url);
  }

  };

  const handleChoose = (key: keyof files) => {
    inputRefs[key].current?.click();
  };
  const handleUpload = async () => {
    if(!(file.u && file.r && file.d &&file.l)&&!file.v){return}
    setSpinner(true);
    const form = new FormData();
    form.append("video", file.v?file.v:'');
    form.append("uppic", file.u?file.u:'');
    form.append("downpic", file.d?file.d:'');
    form.append("rightpic", file.r?file.r:'');
    form.append("leftpic", file.l?file.l:'');
    const res=await fetch(`${process.env.NEXT_PUBLIC_NEST_API_BASE_URL}/upload`, {
      method: "POST",
      body: form
    });
    const data = await res.json();

    setMediaUrl(data.url);
    setHash(data.hash);
    setSpinner(false);
  };
  
  return (
    <div className="App">
      <SpinnerOverlay
        visible={spinner}
      />
      <button onClick={()=>setType('input')} className="w-full bg-zinc-700 hover:bg-black">input code to view</button>
      <button onClick={()=>setType('upload')} className="w-full bg-zinc-700 hover:bg-black">make and share</button>
      {type=='input'&&(
        <div>
          <InputComponents setHash={setHash} setSpinner={setSpinner} setMediaUrl={setMediaUrl} setLayer={setLayer} setType={setType} hash={hash}/>
        </div>
      )}
      {type=='showv'&&(
        <div className="min-h-screen bg-black ">
          <div className="hologram-container relative inline-block">
            <video
              src={mediaUrl}
              controls
              autoPlay
              loop
              style={{filter:filter[0]}}
              className="w-full max-h-[400px] rounded hologram-video"
            />
            <div className="scanlines absolute inset-0 pointer-events-none" style={{display:filter[1]}}></div>
          </div>
          <FilterComponents cboxes={cboxes} setCboxes={setCboxes} setFilter={setFilter}/>
      </div>
      )}
      {type=='showp'&&(
        <div className="min-h-screen bg-black ">
          <div className="relative w-fit overflow-hidden rounded">
            <img 
              src={mediaUrl} 
              alt="Sample" 
              style={{filter:filter[0]}}
              className="w-full rounded hologram-image"
            />
            <div className="scanlines absolute inset-0 pointer-events-none" style={{display:filter[1]}}></div>
          </div>
          <FilterComponents cboxes={cboxes} setCboxes={setCboxes} setFilter={setFilter} />
        </div>
      )}
      {type === 'upload' && (
        <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded shadow-md">
          <UploadComponents
            inputRefs={inputRefs}
            handleFileChange={handleFileChange}
            source={source}
            handleChoose={handleChoose}
            handleUpload={handleUpload}
            hash={hash}
            file={file}
          />
        </div>
      )}
    </div>
  );
}

export default App;
