import { useEffect, useState } from "react";

export default function Hero() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">

      <div className="text-center max-w-3xl px-6 z-10">

        {/* Badge */}
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 text-sm tracking-wide animate-pulse">
          Introducing Vibra
        </span>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Vibra — AI-Powered Chat With Emotional Intelligence
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl opacity-90 mb-8">
          Vibra is a real-time global chat platform that understands tone,
          detects toxic conversations, and promotes healthier discussions{dots}
        </p>

        {/* UPDATED BUTTONS */}
        <div className="flex justify-center gap-4 flex-wrap">

          <a
            href="/signup"
            className="px-8 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:scale-105 transition transform"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="px-8 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-indigo-700 transition"
          >
            Login
          </a>

        </div>
      </div>

      {/* Floating Background Circles */}
      <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-white/10 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-white/5 rounded-full animate-pulse-slow"></div>

    </section>
  );
}
