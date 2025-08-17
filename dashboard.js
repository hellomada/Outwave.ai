import { useState } from "react";

export default function Dashboard() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sendEmail = async () => {
    const res = await fetch("https://your-backend-url/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: "user_refresh_token_here", // TODO: fetch from DB
        to,
        subject,
        body,
      }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Send Email</h1>
      <input
        className="border p-2 my-2 w-full"
        placeholder="Recipient"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        className="border p-2 my-2 w-full"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        className="border p-2 my-2 w-full"
        rows={6}
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={sendEmail}
      >
        Send
      </button>
    </div>
  );
}
