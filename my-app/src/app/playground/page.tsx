"use client";
import React, { useState, useEffect,useRef} from 'react';
import './app.css';
import { nodeServerAppPaths } from 'next/dist/build/webpack/plugins/pages-manifest-plugin';


// Itemの型定義
type Item = {
  columns: string[];
  name: string;
  serial: number;
};
interface TableResponse {
  status: string;
  data: {
    name: string;
    columns: string;
    serial: number;
  }[];
}

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsA,setItemsA] = useState<Item[]>([]);
  const [itemsB,setItemsB] = useState<Item[]>([]);
  const [nodesList,setNodes]=useState<[string,number,string,number][]>([]);
  const fetchTable = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_table`);
      const data: TableResponse = await res.json();
      const updatedData = data.data.map(item => ({
    ...item,
    columns: item.columns.split(","), // item.columnsが文字列なので、これをパースして配列に
  }));

  setItemsA(updatedData); 
    };
  useEffect(() => {
    // ページロード時に GET API を叩く
    fetchTable();
    console.log(nodesList);
  }, []);
  
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item, from: 'A' | 'B') => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('from', from);
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: 'A' | 'B'
  ) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('item');
    const fromList = e.dataTransfer.getData('from') as 'A' | 'B';
    const droppedItem: Item = JSON.parse(itemData);
  
    if (target === fromList) return; // 同じリストへのドロップは無視
  
    // 両リストを更新する（元から削除、先に追加）
    let newItemsA = itemsA;
    let newItemsB = itemsB;
  
    if (fromList === 'A') {
      newItemsA = itemsA.filter(i => i.serial !== droppedItem.serial);
      newItemsB = [...itemsB, droppedItem];
    } else {
      newItemsB = itemsB.filter(i => i.serial !== droppedItem.serial);
      newItemsA = [...itemsA, droppedItem];
    }
  
    // 一括で更新
    setItemsA(newItemsA);
    setItemsB(newItemsB);
  };
  const dragNode=(
    e:React.DragEvent<HTMLSpanElement>,
    item:string,
    index:number
  )=>{
    let nodes=nodesList.filter(node=>node[2]!=="notConnected");
    nodes=[...nodes,[item,index,"notConnected",0]];
    setNodes(nodes);
  }
  const connectNode=(
    e:React.DragEvent<HTMLSpanElement>,
    item:string,
    index:number
  )=>{
    e.preventDefault();
    let nodes=nodesList;
    const connectedNodes=nodes.map(node=>{
      if(node[2]==="notConnected"&&node[0]!=item){
        return [node[0],node[1],item,index] as [string,number,string,number];
      }else{
        return node;
      }
    });
    setNodes(connectedNodes);
  }
  const resetButton=(itemName:string)=>{
    let nodes=nodesList.filter(node=>node[0]!==itemName&&node[2]!==itemName);
    
    setNodes(nodes);
  }
  const delNode=(node2del:[string, number, string, number])=>{
    let nodes=nodesList.filter(node=>node!==node2del);
    console.log(nodes);
    setNodes(nodes);
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container" ref={containerRef}>
      {/* リストA */}
      <div
        className="list"
        onDrop={(e) => onDrop(e, 'A')}
        onDragOver={onDragOver}
      >
        <h3>リストA（ドラッグ元）</h3>
        {itemsA.map(item => (
          <div
            key={item.serial}
            className="draggable"
            draggable
            onDragStart={(e) => onDragStart(e, item, 'A')}
          >
            {item.name}
            
          </div>
        ))}
      </div>

      {/* リストB */}
      <div
        className="dropzone"
        onDrop={(e) => onDrop(e, 'B')}
        onDragOver={onDragOver}
      >
        <h3>リストB（ドロップ先）</h3>
        {itemsB.map(item => (
          <div
            key={item.serial}
            className="draggable"
            draggable
            onDragStart={(e) => onDragStart(e, item, 'B')}
          >
            {item.name}<button className="reset" onClick={() => resetButton(item.name)}>
                          ↺
                        </button>
            <div className="nodes">
            {item.columns.map((column,index)=>(
              <span 
                id={`node-${item.name}-${index}`}
                key={index} 
                className="column-item draggable" 
                draggable
                onDragStart={(e) => dragNode(e, item.name, index)}
                onDrop={(e) => connectNode(e, item.name, index)}
                onDragOver={onDragOver}>

                {column}

              </span>
            ))}
            </div>
          </div>
        ))}
      </div>
      <a
          href="/edit_table"
          className="text-blue-600 hover:underline"
        >
          edit table
        </a>
    <svg className="connection-layer">{/*node接続表示*/}
      {nodesList.map(([fromItem, fromIdx, toItem, toIdx], i) => {
        const fromEl = document.getElementById(`node-${fromItem}-${fromIdx}`);
        const toEl = document.getElementById(`node-${toItem}-${toIdx}`);
        if (!fromEl || !toEl) return null;
  
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
  
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return null;
  
        const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
        const x2 = toRect.left + toRect.width / 2 - containerRect.left;
        const y2 = toRect.top + toRect.height / 2 - containerRect.top;
  
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="blue"          // ← 色を指定
            strokeWidth="2"
            strokeOpacity="0.5" 
            onClick={() => delNode([fromItem, fromIdx, toItem, toIdx])}
          />
        );
      })}
  </svg>
    </div>
  );
};

export default App;
