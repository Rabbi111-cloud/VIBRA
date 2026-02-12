export default function Features() {
  const features = [
    {
      title: "Communities",
      desc: "Join or create global chat communities that match your interests.",
      icon: "🌐"
    },
    {
      title: "Chat Channels",
      desc: "Real-time messaging with AI sentiment detection to keep chats friendly.",
      icon: "💬"
    },
    {
      title: "Voice Channels",
      desc: "Optional voice rooms for live conversations with friends or teams.",
      icon: "🎤"
    },
    {
      title: "Smart Moderation",
      desc: "AI suggests cooldowns for messages that could escalate tensions.",
      icon: "🛡️"
    },
    {
      title: "Cross-Platform",
      desc: "Works anywhere — web, mobile, fast and reliable.",
      icon: "📱"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Key Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
