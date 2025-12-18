import React from "react";

const testimonials = [
  {
    text: `"I'm a beginner when it comes to studies, but SmartLearn helped me improve with engaging tools!"`,
    name: "Abby Gonda",
    img: "/user1.png",
    rating: "★★★★☆",
  },
  {
    text: `"The interactive quizzes make learning fun. It’s easier to understand concepts now!"`,
    name: "Abby Gonda",
    img: "/user1.png",
    rating: "★★★★☆",
  },
  {
    text: `"My skills improved a lot using SmartLearn daily. Highly recommended!"`,
    name: "Abby Gonda",
    img: "/user1.png",
    rating: "★★★★☆",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-blue-100">
      <h2 className="text-center text-4xl font-extrabold mb-14">
        What Our <span className="text-blue-600">Users</span> Say?
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <p className="text-gray-700">{t.text}</p>

            <div className="flex items-center gap-3 mt-4">
              <img src={t.img} className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-yellow-500 text-sm">{t.rating}</p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default Testimonials;
