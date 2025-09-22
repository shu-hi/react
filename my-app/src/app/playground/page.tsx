"use client";
import React, { useState, useEffect } from 'react';
import './app.css';

// Itemの型定義
type Item = {
  index: string;
  name: string;
  serial:number;
};
interface TableItem {
  name: string;
  index: string;
  serial:number;
}
interface TableResponse {
  status: string;
  data: TableItem[];
}
const App: React.FC = () => {
  const fetchTable = async () => {
      const res = await fetch("http://54.65.233.242/api/get_table");
      const data: TableResponse = await res.json();
      setItemsA(data.data);
    };
  useEffect(() => {
    // ページロード時に GET API を叩く
    fetchTable();
  }, []);
  const [itemsA,setItemsA] = useState<Item[]>([]);
  const [itemsB,setItemsB] = useState<Item[]>([]);

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
  

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container">
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
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
