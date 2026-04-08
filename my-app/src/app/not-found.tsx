'use client';

export default function NotFound() {
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
        src="https://http.cat/404"
        alt="404 Error"
        style={{ maxWidth: "600px", width: "100%", height: "auto" }}
      />
    </div>
  );
}