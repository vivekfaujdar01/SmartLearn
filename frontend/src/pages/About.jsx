import { BookOpen, Users, Award, Target, Heart, Globe, Mail, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const team = [
  { name: "Vivek Faujdar", role: "Contributer", avatar: "VF", linkedin: "https://www.linkedin.com/in/vivekfaujdar01/" },
  { name: "Sai Satish", role: "Contributer", avatar: "SS", linkedin: "#" },
  { name: "Bhoomi Jain", role: "Contributer", avatar: "BH", linkedin: "#" }
];

const values = [
  { icon: Target, title: "Mission-Driven", description: "Democratizing quality education for everyone, everywhere." },
  { icon: Heart, title: "Student-First", description: "Every decision we make puts our learners at the center." },
  { icon: Globe, title: "Accessible", description: "Breaking barriers to make learning available to all." },
  { icon: Award, title: "Excellence", description: "Committed to delivering the highest quality content." }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            About SmartLearn
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Empowering millions to learn, grow, and achieve their dreams through quality education.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              SmartLearn began as a full stack college project in 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center feature-tilt">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Passionate educators, technologists, and dreamers working together to transform education.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center course-tilt w-full max-w-[280px]">
                <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                  {member.avatar}
                </div>
                <h3 className="font-display font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                <a href={member.linkedin} className="text-primary hover:text-primary/80">
                  <Linkedin className="w-5 h-5 mx-auto" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl font-display font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg opacity-90 mb-8">
            Whether you're here to learn or to teach, we'd love to have you as part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" className="px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-xl tilt-button glow-hover">
              Explore Courses
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-primary-foreground/20 text-primary-foreground font-semibold rounded-xl tilt-button backdrop-blur-sm">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        © 2025 SmartLearn. All rights reserved.
      </footer>
    </div>
  );
}
