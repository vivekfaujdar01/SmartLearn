import React from "react";

const products = [
  {
    title: "AI-Powered Interactive Learning",
    desc: "Personalized learning modules that adapt to your learning style.",
    icon: "🤖",
  },
  {
    title: "Career Guidance Platform",
    desc: "AI-driven career paths and personalized recommendations.",
    icon: "🎓",
  },
  {
    title: "Community & Forums",
    desc: "Collaborate, share knowledge and learn together.",
    icon: "👥",
  },
];

const Products = () => {
  return (
    <section className="bg-blue-600 text-white py-20 rounded-b-[60px]">
      <h2 className="text-center text-4xl font-extrabold mb-14">
        Our <span className="text-white/80">Next-Gen Learning</span> Products
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        {products.map((item, i) => (
          <div
            key={i}
            className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition cursor-pointer"
          >
            <div className="text-4xl">{item.icon}</div>
            <h3 className="font-bold text-xl mt-4">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.desc}</p>
          </div>
        ))}

      </div>
    </section>
  );
};

export default Products;
