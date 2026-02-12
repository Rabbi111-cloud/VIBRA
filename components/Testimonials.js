const testimonials = [
  {
    name: "Alex, Community Manager",
    text: "Vibra keeps our community friendly and engaging!",
    avatar: "🧑‍💼"
  },
  {
    name: "Maria, Startup Founder",
    text: "Finally, a chat app that understands tone!",
    avatar: "👩‍💻"
  },
  {
    name: "Jules, Game Moderator",
    text: "The AI cooldown suggestions save us so much time.",
    avatar: "🎮"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">What Users Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-4">{t.avatar}</div>
              <p className="mb-4 text-gray-700 italic">"{t.text}"</p>
              <h3 className="font-semibold">{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
