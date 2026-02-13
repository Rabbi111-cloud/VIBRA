import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { auth } from "../firebase";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Screenshots from "../components/Screenshots";
import CTA from "../components/CTA";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 🔥 Login with Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <p className="text-xl font-semibold animate-pulse">Loading Vibra...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Vibra — AI-Powered Chat With Emotional Intelligence</title>
        <meta
          name="description"
          content="Vibra is an AI-powered global chat platform that understands tone, detects toxicity, and promotes healthier conversations."
        />
      </Head>

      <Hero />
      <Features />
      <Screenshots />

      {/* CTA Section */}
      <CTA>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Sign up / Login with Google
          </button>
        </div>
      </CTA>

      <Testimonials />
      <Footer />
    </>
  );
}
