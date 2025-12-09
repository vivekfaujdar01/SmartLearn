import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-14">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 px-6">

        {/* Brand */}
        <div>
          <h3 className="text-2xl font-extrabold">SmartLearn</h3>
          <p className="mt-3 text-blue-200">
            Transforming Education, One Innovation at a Time!
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-blue-200">
            <li>Home</li>
            <li>Product</li>
            <li>Contact</li>
            <li>About</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4">Contact Us</h4>
          <p>📞 +91 123456789</p>
          <p>📧 smartlearn@gmail.com</p>
          <p>📍 Coming Soon</p>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <input 
            type="email"
            placeholder="Your email"
            className="px-4 py-2 rounded-md w-full text-gray-900"
          />
          <button className="px-4 py-2 bg-white text-blue-700 rounded-md mt-3 w-full hover:bg-gray-200 transition">
            Subscribe
          </button>
        </div>

      </div>

      <p className="text-center mt-10 text-blue-200">
        © 2025 SmartLearn. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
