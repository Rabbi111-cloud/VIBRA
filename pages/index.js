import Head from "next/head";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Screenshots from "../components/Screenshots";
import CTA from "../components/CTA";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
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
