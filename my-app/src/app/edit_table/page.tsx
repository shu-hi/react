"use client";
import { useState, useEffect } from "react";

interface TableItem {
  name: string;
  columns: string;
  serial:number;
}

interface TableResponse {
  status: string;
  data: TableItem[];
}

export default function editTablePage() {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState("");
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
    body: JSON.stringify({ name: name,columns:columns }),
  });
  const data = await res.json();
  fetchTable();
  };
  const handleDelete = async(name: string) => {
    const res = await fetch("http://54.65.233.242/api/del_table", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name }),
  });
  const data = await res.json();
  console.log(data);
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
          placeholder="columns"
          value={columns}
          onChange={(e) => setColumns(e.target.value)}
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
              {item.name} - {item.columns}
                <button
                  onClick={() => handleDelete(item.name)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  削除
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    <a
          href="/playground"
          className="text-blue-600 hover:underline"
        >
          playground
        </a>
    </div>
    
  );
}