export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to Outwave Email SaaS</h1>
      <a
        href="http://localhost:8080/auth/google"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Connect Gmail
      </a>
    </div>
  );
}
