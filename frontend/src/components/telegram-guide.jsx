import React from "react";
import { Link } from "react-router-dom";
import UnauthenticatedNavbar from "./unauthnavbar";
import Footer from "./footer";

function TelegramGuide() {
  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col">
      <UnauthenticatedNavbar />
      <main className="flex-grow px-6 py-12 bg-blue-50">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Get Started with the Telegram Bot</h1>
          <p className="mb-6 text-center">
            Use our Telegram bot to log expenses and manage your finances on the go!
          </p>
          <div className="mb-6 flex justify-center">
            <a
              href="https://t.me/expensestrackerfinancebot" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition"
            >
              Open Telegram Bot
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              Click the button above to open the Telegram bot.
            </li>
            <li>
              Press <b>Start</b> in Telegram to activate the bot.
            </li>
            <li>
              Use <code>/addexpense</code> to log a new expense.
            </li>
            <li>
              Use <code>/viewexpenses</code> to see your recent expenses.
            </li>
            <li>
              Explore more commands in the bot menu or type <code>/help</code>.
            </li>
          </ol>
          <div className="mt-8 text-center">
            <Link to="/">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TelegramGuide;
