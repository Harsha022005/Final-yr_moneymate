import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UnauthenticatedNavbar from "./unauthnavbar";
import Footer from "./footer";

function App() {
  const navigate = useNavigate();

  const handleNewUserClick = () => {
    navigate("/telegram-guide");
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <UnauthenticatedNavbar />

      {/* Hero Section */}
      <section className="bg-blue-50 px-6 py-12 text-center md:text-left md:flex md:items-center md:justify-between">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simplify Your Finances.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Track your expenses, visualize spending, get predictions, and automate alerts – all in one app powered by Telegram Bot.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition">
                Get Started
              </button>
            </Link>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition"
              onClick={handleNewUserClick}
            >
              New User?
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <img src="https://img.freepik.com/free-vector/financial-management-isometric-composition-with-3d-budget-planning-money-symbols-dark-background-vector-illustration_1284-73166.jpg" alt="Finance illustration" className="max-w-md" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <FeatureCard title="Add & View Expenses" desc="Log daily expenses via Telegram and view them in the dashboard." />
          <FeatureCard title="Category-wise Charts" desc="Visualize spending across categories like Food, Travel, Bills, etc." />
          <FeatureCard title="Monthly Reports" desc="Track how your spending evolves month by month." />
          <FeatureCard title="Stock Expense Graphs" desc="See real-time stock profit/loss based expenses in line charts." />
          <FeatureCard title="Future Expense Prediction" desc="AI-powered predictions to help you manage upcoming expenses." />
          <FeatureCard title="Smart Alerts" desc="Get notified when you overspend or trends shift unexpectedly." />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-700">{desc}</p>
    </div>
  );
}

export default App;
