"use client"
import React, { useState } from "react";
import axios from "axios";

function App() {
  // CSVファイルを保持する状態
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // ファイルが選択された時の処理
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      setMessage("Please select a valid CSV file.");
    }
  };

  // フォームの送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    // フォームデータを作成してファイルを送信
    const formData = new FormData();
    formData.append("csv", file);
    setMessage("processing, it'll take some time...");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/make_faiss`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage("Error uploading file.");
    }
  };

  return (
    <div className="App">
      <h1>CSV File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button type="submit">Upload CSV</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
