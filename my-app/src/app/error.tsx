'use client';

export default function Error() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <img
        src="https://http.cat/500"
        alt="500 Error"
        style={{ maxWidth: "600px", width: "100%", height: "auto" }}
      />
    </div>
  );
}