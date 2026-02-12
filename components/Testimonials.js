const testimonials = [
  {
    name: "Alex, Community Manager",
    text: "Vibra keeps our community friendly and engaging!"
  },
  {
    name: "Maria, Startup Founder",
    text: "Finally, a chat app that understands tone!"
  },
  {
    name: "Jules, Game Moderator",
    text: "The AI cooldown suggestions save us so much time."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="mb-4 text-gray-700">"{t.text}"</p>
              <h3 className="font-semibold">{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
