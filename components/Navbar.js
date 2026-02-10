export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl text-indigo-600">ToneGuard</h1>
        <div className="space-x-4">
          <a href="/login" className="text-gray-600 hover:text-black">Login</a>
          <a href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  )
}

