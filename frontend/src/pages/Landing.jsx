
import Navbar from "/Users/jimin/Documents/Project/Smart-Learn/SmartLearn/frontend/src/components/Navbar";
import Hero from "/Users/jimin/Documents/Project/Smart-Learn/SmartLearn/frontend/src/components/Hero";
import Products from "/Users/jimin/Documents/Project/Smart-Learn/SmartLearn/frontend/src/components/Products";
import Roadmap from "/Users/jimin/Documents/Project/Smart-Learn/SmartLearn/frontend/src/components/Roadmap";
import Testimonials from "/Users/jimin/Documents/Project/Smart-Learn/SmartLearn/frontend/src/components/Testmonials.jsx";
import Footer from "/Users/jimin/Documents/Project/Smart-Learn/SmartLearn/frontend/src/components/Footer";

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
