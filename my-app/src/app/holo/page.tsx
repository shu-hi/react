"use client"
import React, { useState,useRef } from "react";
import axios from "axios";
import {holoMedia,defaultShowHandlerFactory,darkShowHandlerFactory} from "./showHolo";
import SpinnerOverlay from './SpinnerOverlay';
function App() {
  // CSVファイルを保持する状態
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'input'|'show'|'upload'>("upload");
  const [mediaUrl,setMediaUrl]=useState('');
  const [mediaLayer,setLayer]=useState(false);
  const [spinner, setSpinner] = useState(false);
  const [hash, setHash] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpinner(true);
    const media=new holoMedia(hash);
    const defaultShowHandler=new defaultShowHandlerFactory(setMediaUrl,setLayer);
    media.subscribe(defaultShowHandler.holoUpdater());
    media.subscribe(defaultShowHandler.layerUpdater());
    await media.getMediaReady();//observer pattern を無理に使ったのでlayer,urlの更新処理が見えなくなってしまった。reactとは相性が悪いかもしれない
    setType('show');
    setSpinner(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFile(file);
    setSource(url);
  };

  const handleChoose = (e: React.FormEvent) => {
    inputRef.current?.click();
  };
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSpinner(true);
    const form = new FormData();
    form.append("video", file);
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}upload`, {
      method: "POST",
      body: form
    });
    setMediaUrl(res.url);
    setSpinner(false);
  };
  return (
    <div className="App">
      <SpinnerOverlay
        visible={spinner}
      />
      <button onClick={()=>setType('input')}>input code to view</button>
      <button onClick={()=>setType('upload')}>make and share</button>
      {type=='input'&&(
        <div>
          <form onSubmit={handleSubmit} className="login-form">
            <div>
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
      )}
      {type=='show'&&(
        <div>{mediaUrl}</div>
      )}
      {type === 'upload' && (
        <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded shadow-md">
          {/* ファイル選択 */}
          <div className="mb-4 flex flex-col items-center">
            <input
              ref={inputRef}
              type="file"
              accept=".mov,.mp4"
              className="hidden"
              onChange={handleFileChange}
            />
            {!source ? (
              <button
                onClick={handleChoose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200"
              >
                動画を選択
              </button>
            ) : null}
          </div>
      
          {/* 動画プレビュー */}
          {source && (
            <div className="mb-4">
              <video
                src={source}
                controls
                className="w-full max-h-[400px] rounded-lg border border-gray-300"
              />
            </div>
          )}
      
          {/* アップロードボタン */}
          {source && (
            <div>
              <button
                onClick={handleUpload}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded transition-colors duration-200"
              >
                Submit
              </button>
              {hash&&(
                <div>
                  <p>{hash}</p>
                  <a href="#">share</a>
                </div>
              )}
            </div>
          )}
      
          {/* ファイル名 / 状態表示 */}
          <div className="text-center text-gray-600 text-sm">
            {source ?'': "ファイルが選択されていません"}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
