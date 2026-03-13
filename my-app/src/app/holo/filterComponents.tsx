import { useRef,useEffect } from "react";
class mediaFilter{
    private monochro:boolean=false;
    private bluenize:boolean=false;
    private scanline:boolean=false;
    constructor(monochro:boolean,bluenize:boolean,scanline:boolean){
        this.monochro=monochro;
        this.bluenize=bluenize;
        this.scanline=scanline;
    }
    changeState(monochro:boolean,bluenize:boolean,scanline:boolean){
        this.monochro=monochro;
        this.bluenize=bluenize;
        this.scanline=scanline;
    }
    public save(): Memento {
        return new mediaMemento(this.monochro, this.bluenize, this.scanline);
    }
    display():string[]{
        return [((this.monochro||this.bluenize)?'grayscale(100%)':'')+(this.bluenize?'sepia(100%) hue-rotate(190deg) saturate(200%)':''),this.scanline?'block':'none']
    }
    restore(memento:mediaMemento):void{
        this.monochro=memento.getMonochro();
        this.bluenize=memento.getBluenize();
        this.scanline=memento.getScanline();
    }
}
interface Memento{
    getMonochro():boolean;
    getBluenize():boolean;
    getScanline():boolean;
}
class mediaMemento implements Memento{
    private readonly monochro:boolean=false;
    private readonly bluenize:boolean=false;
    private readonly scanline:boolean=false;
    constructor(monochro:boolean,bluenize:boolean,scanline:boolean){
        this.monochro=monochro;
        this.bluenize=bluenize;
        this.scanline=scanline;
    }
    getMonochro():boolean{
        return this.monochro;
    };
    getBluenize():boolean{
        return this.bluenize;
    };
    getScanline():boolean{
        return this.scanline;
    };
}
class CareTaker{
    private scenes:{[name:string]:Memento}={};
    private mediaFilter:mediaFilter;
    constructor(mediaFilter:mediaFilter){
        this.mediaFilter=mediaFilter;
    }
    public backup(name:string):void{
        this.scenes[name]=this.mediaFilter.save();
    }
    public restore(name:string):void{
        if (this.scenes[name]) {
            this.mediaFilter.restore(this.scenes[name] as mediaMemento);
        } else {
            console.log(`Scene "${name}" does not exist.`);
        }
    }
    public get(name:string):Memento | undefined{
        return this.scenes[name];
    }
}
const FilterComponents=({cboxes,setCboxes,setFilter}:{cboxes:boolean[],setCboxes:React.Dispatch<React.SetStateAction<boolean[]>>,setFilter:React.Dispatch<React.SetStateAction<string[]>>})=>{
    const filterMap=['grayscale','hologram','scanline'];
    const mediafilterRef = useRef(new mediaFilter(false,false,false));
    const caretakerRef = useRef(new CareTaker(mediafilterRef.current));
    useEffect(()=>{
        caretakerRef.current.backup("default");
    },[]);
    const handleCheckboxChange = (id:number) => {
        setCboxes((prevCheckboxes: boolean[]) =>{
            const newCheckboxes = [...prevCheckboxes];
            newCheckboxes[id] = !newCheckboxes[id]; // 対象のチェックボックスの状態を反転
            mediafilterRef.current.changeState(
                newCheckboxes[0],
                newCheckboxes[1],
                newCheckboxes[2]
            );
            caretakerRef.current.backup("custom");
            setFilter(mediafilterRef.current.display());
            return newCheckboxes;
        });
    };
    const restoreScene=(name:string)=>{
        const memento = caretakerRef.current.get(name);
        if(!memento) return;
        // React state復元
        const newCboxes=[
            memento.getMonochro(),
            memento.getBluenize(),
            memento.getScanline()
        ];
        setCboxes(newCboxes);
        mediafilterRef.current.restore(memento as mediaMemento);
        setFilter(mediafilterRef.current.display());
    };
    return (
    <div
        style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        background: "rgba(0,0,0,0.45)",
        borderRadius: "10px",
        backdropFilter: "blur(6px)"
        }}
    >
        {cboxes.map((checkbox, id) => (
        <label
            key={id}
            style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer"
            }}
        >
            <input
            type="checkbox"
            checked={checkbox}
            onChange={() => handleCheckboxChange(id)}
            />
            <span
            style={{
                color: "#bbb",
                fontSize: "14px",
                userSelect: "none"
            }}
            >
            {filterMap[id]}
            </span>
        </label>
        ))}
    
        <button
        onClick={() => restoreScene("default")}
        style={{
            background: "#2c2c2c",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "4px 6px",
            cursor: "pointer"
        }}
        >
        <span style={{ color: "#bbb", fontSize: "13px" }}>default</span>
        </button>
    
        <button
        onClick={() => restoreScene("custom")}
        style={{
            background: "#2c2c2c",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "4px 6px",
            cursor: "pointer"
        }}
        >
        <span style={{ color: "#bbb", fontSize: "13px" }}>custom</span>
        </button>
    </div>
    );
}
export default FilterComponents;