"use client";
import React, { useState } from 'react';

const StreamChat = () => {
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) return;

    setLoading(true);
    setText(""); // クリア

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rag/${encodeURIComponent(query)}`,
        { cache: "no-store" }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        const decoded = decoder.decode(value);
        setText((prev) => prev + decoded);
      }

      setLoading(false);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Stream Chat</h1>

      <form onSubmit={handleSubmit}className="flex flex-col gap-4 w-full max-w-md">
        <textarea 
          value={query} 
          onChange={(e) => {setQuery(e.target.value);
            e.target.style.height = "auto"; // textareaサイズ拡大処理
            e.target.style.height = `${e.target.scrollHeight}px`;
          }} 
          className="border rounded px-3 py-2 overflow-hidden resize-none"
          required/>
        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">Send</button>
      </form>

      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
};

export default StreamChat;
