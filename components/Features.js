export default function Features() {
  const features = [
    {
      title: "Communities",
      desc: "Join or create global chat communities that matter to you."
    },
    {
      title: "Chat Channels",
      desc: "Real-time messaging with AI sentiment detection to reduce toxicity."
    },
    {
      title: "Voice Channels",
      desc: "Optional voice rooms for live conversations and team calls."
    },
    {
      title: "Smart Moderation",
      desc: "AI suggests cooldowns for messages that could escalate tensions."
    },
    {
      title: "Cross-Platform",
      desc: "Works anywhere — web, mobile, fast and reliable."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
