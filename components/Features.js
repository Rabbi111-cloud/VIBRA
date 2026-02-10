const features = [
  ["🧠 AI Sentiment Detection", "Detects toxic tone in real time"],
  ["⏸ Cooldown Suggestions", "Prevents escalation in chats"],
  ["⚡ Real-Time Messaging", "Fast and seamless chat experience"],
  ["🌍 Global Communities", "Connect with people worldwide"]
]

export default function Features() {
  return (
    <section id="features" className="py-24">
      <h2 className="text-3xl font-bold text-center">
        Powerful Features
      </h2>

      <div className="mt-12 grid max-w-6xl mx-auto px-6 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(([title, desc]) => (
          <div key={title} className="p-6 border rounded-xl hover:shadow">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
