export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="p-8 border rounded w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="w-full border p-2 mb-3" placeholder="Email" />
        <input className="w-full border p-2 mb-3" placeholder="Password" type="password" />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}
