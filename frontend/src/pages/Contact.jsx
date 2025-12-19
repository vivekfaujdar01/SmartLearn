import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "vivekfaujdar06@gmail.com", href: "mailto:vivekfaujdar06@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 8279275902", href: "tel:+918279275902" },
  { icon: MapPin, label: "Address", value: "LPU, Jalandhar, Punjab", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon - Fri: 9AM - 6PM IST", href: "#" }
];

const faqs = [
  { q: "How do I enroll in a course?", a: "Simply browse our courses, click on the one you like, and hit 'Enroll Now'. You'll be guided through the process!" },
  { q: "Can I get a refund?", a: "Yes! We offer a 7-day money-back guarantee on all courses if you're not satisfied." },
  { q: "How do I become an instructor?", a: "Register as an instructor from our sign-up page. Once approved, you can start creating courses." }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-20 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Contact Info */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h2 className="text-2xl font-display font-bold mb-6">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-lg">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h2 className="text-2xl font-display font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
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
