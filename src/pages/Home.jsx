import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import WhyUs from "../components/WhyUs";
import Products from "../components/Products";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";
import QuoteForm from "../components/QuoteForm";
import WhatsAppButton from "../components/WhatsAppButton";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Header />
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <WhyUs />
      <section id="products"><Products /></section>
      <Stats />
      <Features />
      <Certificates />
      <section id="contact"><Contact /></section>
      <QuoteForm />
      <WhatsAppButton />
      <Footer />
    </>
  );
}

export default Home;
