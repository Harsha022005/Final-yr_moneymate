import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              We are dedicated to helping individuals and businesses take control of their finances through smart, simple, and secure technology. Our finance tracker is designed to turn complex financial data into clear insights—so you can track spending, manage budgets, and make informed decisions with confidence. By combining intelligent analytics with an easy-to-use experience, we aim to empower better financial habits and long-term financial growth for everyone.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { }} className="hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 text-white">Home</button>
              </li>
              <li>
                <button onClick={() => { }} className="hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 text-white">Services</button>
              </li>
              <li>
                <button onClick={() => { }} className="hover:text-gray-300 bg-transparent border-none cursor-pointer p-0 text-white">Contact</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm">
              Email: moneymate@gmail.com <br />
              Phone: +91 9999444433 <br />
              Address: 123 Main St, Visakhapatnam, Andhra Pradesh ,India
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MoneyMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
