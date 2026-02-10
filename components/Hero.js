export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="text-center max-w-3xl px-6">

        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 text-sm tracking-wide">
          Introducing Vibra
        </span>

        <h1 className="text-5xl font-bold mb-6">
          Vibra — AI-Powered Global Chat With Emotional Intelligence
        </h1>

        <p className="text-lg opacity-90 mb-8">
          Vibra is a real-time communication platform that understands tone,
          detects toxic conversations, and promotes healthier discussions.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium"
          >
            View Demo
          </a>

          <a
            href="#"
            className="px-6 py-3 border border-white rounded-lg"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </section>
  );
}
