import React from "react";

const roadmap = [
  {
    title: "Analytics Dashboard",
    points: [
      "Real-time insights into student performance",
      "Data-driven educator decisions"
    ],
    icon: "📊",
  },
  {
    title: "AI Tutors",
    points: [
      "Personalized learning powered by AI",
      "Adaptive paths for each student"
    ],
    icon: "🤖",
  },
  {
    title: "VR/AR Integration",
    points: [
      "Immersive visual learning experience",
      "Interactive 3D models for deeper understanding"
    ],
    icon: "🕶️",
  },
  {
    title: "Global Expansion",
    points: [
      "Breaking geographical learning barriers",
      "Seamless online student–teacher interaction"
    ],
    icon: "🌐",
  },
];

const Roadmap = () => {
  return (
    <section className="py-20 bg-white">
      <h2 className="text-center text-4xl font-extrabold">
        Future <span className="text-blue-600">Education</span> Roadmap
      </h2>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mt-4">
        Transforming education with AI, VR/AR & global connectivity.
      </p>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 mt-14">

        {roadmap.map((card, i) => (
          <div key={i} className="border-2 border-blue-500 rounded-xl p-6 shadow-sm hover:shadow-lg transition">
            <div className="text-4xl">{card.icon}</div>
            <h3 className="font-bold text-xl mt-3">{card.title}</h3>

            <ul className="list-disc ml-6 mt-3 text-gray-600">
              {card.points.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>

          </div>
        ))}

      </div>
    </section>
  );
};

export default Roadmap;
