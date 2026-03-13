import React from "react";

type files = {
  r: File | null;
  l: File | null;
  u: File | null;
  d: File | null;
  v: File | null;
};

interface uploadpropsinterface {
  inputRefs: Record<keyof files, React.RefObject<HTMLInputElement|null>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>,key: keyof files) => void;
  handleChoose: (key:keyof files) => void;
  handleUpload: () => void;
  hash: string;
}
interface uploadprops extends uploadpropsinterface{
  source: string;
}
interface uploadprops2 extends uploadpropsinterface{
  file: files;
}

class uploadVideoComponent {
  uprops: uploadprops;

  constructor(props: uploadprops) {
    this.uprops = props;
  }

  private VideoUploader: React.FC<uploadprops> = ({
    inputRefs,
    handleFileChange,
    source,
    handleChoose,
    handleUpload,
    hash
  }) => {
    return (
      <div>

        {/* ファイル選択 */}
        <div className="mb-4 flex flex-col items-center">
          <input
            ref={inputRefs.v}
            type="file"
            accept=".mov,.mp4"
            className="hidden"
            onChange={(e)=>handleFileChange(e,'v')}
          />

          {!source && (
            <button
              onClick={()=>handleChoose('v')}
              className="bg-blue-600 text-white py-2 px-6 rounded"
            >
              動画を選択
            </button>
          )}
        </div>

        {/* プレビュー */}
        {source && (
          <div className="mb-4">
            <video
              src={source}
              controls
              className="w-full max-h-[400px]"
            />
          </div>
        )}

        {/* アップロード */}
        {source && (
          <div>
            <button
              onClick={handleUpload}
              className="w-full bg-pink-600 text-white py-2 px-4 mb-4 rounded"
            >
              Submit
            </button>

            {hash && (
              <div>
                <p>{hash}</p>
                <button onClick={async()=>{
                    const url = window.location.href;
                    await navigator.clipboard.writeText('ホログラムを体験してみよう。\n'+url+'\n codeに\n'+hash+'\nを入力してtry!');
                    alert("リンクがコピーされました");
                  }}>
                    Share
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    );
  };

  getComponent() {
    return this.VideoUploader;
  }
}

class uploadAdapter {

  videoUploader: uploadVideoComponent;
  uprops: uploadprops2;

  constructor(videoUploader: uploadVideoComponent, props: uploadprops2) {
    this.videoUploader = videoUploader;
    this.uprops = props;
  }

  private PicturesUploader: React.FC<uploadprops2> = ({
    inputRefs,
    handleFileChange,
    file,
    handleChoose,
    handleUpload,
    hash
  }) => {

    const picPosArr: {pos:string,key:keyof files}[] = [
        {pos:'奥', key:'u'},
        {pos:'右', key:'r'},
        {pos:'手前', key:'d'},
        {pos:'左', key:'l'}
    ]

    return (
      <div>

        {picPosArr.map(({pos,key}) => (
            <div key={key} className="mb-4 flex flex-col items-center">
            
                <input
                    ref={inputRefs[key]}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e)=>handleFileChange(e,key)}
                />
            
                <button
                onClick={()=>handleChoose(key)}
                className="bg-blue-600 text-white py-2 px-6 rounded"
                >
                画像を選択 ({pos}){file[key]?'  ✓':''}
                </button>
            
            </div>
        ))}

        {file.u && file.r && file.d && file.l && (
          <div>

            <button
              onClick={handleUpload}
              className="w-full bg-pink-600 text-white py-2 px-4 mb-4 rounded"
            >
              Submit
            </button>

            {hash && (
              <div>
                <p>{hash}</p>
                <button onClick={async()=>{
                    const url = window.location.href;
                    await navigator.clipboard.writeText('ホログラムを体験してみよう。\n'+url+'\n codeに\n'+hash+'\nを入力してtry!');
                    alert("リンクがコピーされました");
                  }}>
                    Share
                </button>
              </div>
            )}

          </div>
        )}

        <div className="text-center text-gray-600 text-sm">
          {!file.u || !file.r || !file.d || !file.l
            ? "ファイルが選択されていません"
            : ""}
        </div>

      </div>
    );
  };

  getComponent() {

    const Video = this.videoUploader.getComponent();
    const Pictures = this.PicturesUploader;

    return () => (
      <div>
        <Video {...this.videoUploader.uprops} />
        <Pictures {...this.uprops} />
      </div>
    );
  }
}

function UploadComponents(props: {
  inputRefs: Record<keyof files, React.RefObject<HTMLInputElement|null>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>,key: keyof files) => void;
  source: string;
  handleChoose: (key: keyof files) => void;
  handleUpload: () => void;
  hash: string;
  file: files;
}) {

  const videoComponent = new uploadVideoComponent({
    inputRefs: props.inputRefs,
    handleFileChange: props.handleFileChange,
    source: props.source,
    handleChoose: props.handleChoose,
    handleUpload: props.handleUpload,
    hash: props.hash
  });

  const adapter = new uploadAdapter(videoComponent, {
    inputRefs: props.inputRefs,
    handleFileChange: props.handleFileChange,
    file: props.file,
    handleChoose: props.handleChoose,
    handleUpload: props.handleUpload,
    hash: props.hash
  });

  const Component = adapter.getComponent();

  return <Component />;
}

export default UploadComponents;