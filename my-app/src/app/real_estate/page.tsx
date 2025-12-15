"use client";
import React, { useEffect, useState } from 'react';

function App() {
  const [mapHtml, setMapHtml] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    // FastAPIサーバーから地図HTMLを取得
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/real_estate/${encodeURIComponent("東京都世田谷区上祖師谷4-24-1")}`,)
      .then(response => response.text())
      .then(data => setMapHtml(data))
      .catch(error => console.error('Error fetching map:', error));
  }, []);

  return (
    <div className="App" >
      <h1>Folium Map in React</h1>
      <div 
        dangerouslySetInnerHTML={{ __html: mapHtml }} 
        className="map-container" />
    </div>
  );
}

export default App;
