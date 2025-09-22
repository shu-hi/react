"use client";
import React, { useState } from 'react';
import './app.css';

// Itemの型定義
type Item = {
  id: number;
  name: string;
};

const App: React.FC = () => {
  const [itemsA,setItemsA] = useState<Item[]>([
    { id: 1, name: 'アイテムA' },
    { id: 2, name: 'アイテムB' },
    { id: 3, name: 'アイテムC' }
  ]);
  const [itemsB,setItemsB] = useState<Item[]>([]);


  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item, from: 'A' | 'B') => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.setData('from', from);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, target: 'A' | 'B') => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('item');
    const fromList = e.dataTransfer.getData('from') as 'A' | 'B';
    const droppedItem: Item = JSON.parse(itemData);

    if (target === fromList) return; 

    if (fromList === 'A') {
      setItemsA(prev => prev.filter(i => i.id !== droppedItem.id));
    } else {
      setItemsB(prev => prev.filter(i => i.id !== droppedItem.id));
    }

    // リストに追加
    if (target === 'A') {
      setItemsA(prev => [...prev, droppedItem]);
    } else {
      setItemsB(prev => [...prev, droppedItem]);
    }
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
            key={item.id}
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
            key={item.id}
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
