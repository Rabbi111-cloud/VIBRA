export default function CTA() {
  return (
    <section className="py-20 bg-indigo-600 text-white text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to experience Vibra?
        </h2>
        <p className="text-lg md:text-xl opacity-90 mb-8">
          Join now and enjoy AI-powered healthy conversations across communities worldwide.
        </p>

        <a
          href="https://vibra-green.vercel.app"
          className="px-10 py-4 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:scale-105 transition transform inline-block"
        >
          Join Vibra
        </a>

        {/* Optional floating circles in background */}
        <div className="absolute top-[-50px] left-[-50px] w-80 h-80 bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-60 h-60 bg-white/5 rounded-full animate-pulse-slow"></div>
      </div>
    </section>
  );
}
