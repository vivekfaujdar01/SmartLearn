
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Roadmap from "../components/Roadmap";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <Hero />
      <Products />
      <Roadmap />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landing;
