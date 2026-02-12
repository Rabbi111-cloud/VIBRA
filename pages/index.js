import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

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

  // Loading screen while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <p className="text-xl font-semibold animate-pulse">
          Loading Vibra...
        </p>
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
      <CTA />
      <Testimonials />
      <Footer />
    </>
  );
}
