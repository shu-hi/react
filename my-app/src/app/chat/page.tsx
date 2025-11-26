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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/streamchat/${encodeURIComponent(query)}`,
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

      <form onSubmit={handleSubmit}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Send</button>
      </form>

      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
};

export default StreamChat;
