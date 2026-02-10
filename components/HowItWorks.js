export default function HowItWorks() {
  const steps = [
    "Users send messages in real time",
    "AI analyzes sentiment instantly",
    "Toxicity triggers gentle interventions",
    "Healthy conversations are maintained"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white p-6 rounded-lg shadow"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                {i + 1}
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
