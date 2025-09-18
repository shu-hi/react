"use client";
import { useState, useEffect } from "react";
interface TableItem {
  name: string;
  index: string;
}

interface TableResponse {
  status: string;
  data: TableItem[];
}

export default function addTablePage() {
  const [name, setName] = useState("");
  const [index, setIndex] = useState("");
  const [tableData, setTableData] = useState<TableItem[]>([]);


  const fetchTable = async () => {
      const res = await fetch("http://54.65.233.242/api/get_table");
      const data: TableResponse = await res.json();
      setTableData(data.data);
    };
  useEffect(() => {
    // ページロード時に GET API を叩く
    fetchTable();
  }, []); //
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://54.65.233.242/api/add_table", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name,index:index }),
  });
  const data = await res.json();
  fetchTable();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">フォーム</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="table name(include schema)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          送信
        </button>
      </form>
      <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">テーブルデータ</h1>
      {tableData.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <ul>
          {tableData.map((item, idx) => (
            <li key={idx}>
              {item.name} - {item.index}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
    
  );
}