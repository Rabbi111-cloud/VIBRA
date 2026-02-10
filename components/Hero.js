export default function Hero() {
  return (
    <section className="bg-gray-50 py-24 text-center">
      <h1 className="text-5xl font-bold">
        Chat Freely. Stay Respectful.
        <span className="block text-indigo-600">Let AI Keep the Peace.</span>
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-gray-600">
        A global chat platform powered by AI sentiment analysis to reduce toxicity
        and promote healthier conversations.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a href="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded">
          Get Started
        </a>
        <a href="#features" className="px-6 py-3 border rounded">
          View Features
        </a>
      </div>
    </section>
  )
}
