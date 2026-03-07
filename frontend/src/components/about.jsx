import React from 'react';
import UnauthenticatedNavbar from './unauthnavbar';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <UnauthenticatedNavbar />
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-20 text-center">
          <h2 className="text-5xl font-extrabold text-blue-800 mb-6 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Welcome to VoiceMate AI
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            VoiceMate AI transforms your Telegram experience with cutting-edge voice technology, delivering a seamless, hands-free way to interact with information and services.
          </p>
        </div>

        {/* Core Services */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Our Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Voice-to-Text Transcription',
                desc: 'Convert voice messages into accurate text effortlessly. Our advanced speech recognition, powered by Whisper and Google STT, supports diverse accents and languages.',
                icon: '📝',
              },
              {
                title: 'Intelligent Chatbot Interaction',
                desc: 'Engage in natural conversations with our AI chatbot. Sophisticated NLP ensures context-aware, relevant responses tailored to your queries.',
                icon: '🤖',
              },
              {
                title: 'Text-to-Voice Synthesis (TTS)',
                desc: 'Enjoy clear, natural-sounding voice responses. Our TTS technology enhances accessibility, letting you listen to information on the go.',
                icon: '🎙️',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features and Benefits */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Additional Features & Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Comprehensive Data Logging',
                desc: 'Securely store every interaction—voice inputs, transcribed text, AI responses, and timestamps—in our robust MongoDB/PostgreSQL database.',
                icon: '📊',
              },
              {
                title: 'Real-time Dashboard Analytics',
                desc: 'Monitor user interactions and chat history through an intuitive dashboard. Gain insights to optimize your chatbot’s performance in real time.',
                icon: '📈',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          <div className="bg-white rounded-2xl p-8 max-w-6xl mx-auto shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  step: 'Voice Input',
                  desc: 'Users send voice messages via Telegram.',
                  img: img_1,
                  alt: 'User sending voice message',
                },
                {
                  step: 'Transcription',
                  desc: 'VoiceMate AI converts voice to text using advanced speech recognition.',
                  img: img_6,
                  alt: 'Voice being transcribed to text',
                },
                {
                  step: 'AI Processing',
                  desc: 'The chatbot processes the text with custom NLP logic.',
                  img: img_2,
                  alt: 'AI analyzing text input',
                },
                {
                  step: 'Response',
                  desc: 'Users receive responses as text or voice (TTS).',
                  img: img_3,
                  alt: 'AI delivering voice or text response',
                },
                {
                  step: 'Data Storage',
                  desc: 'All interactions are logged in our secure database.',
                  img: img_4,
                  alt: 'Data being saved in database',
                },
                {
                  step: 'Dashboard Access',
                  desc: 'Admins view and analyze data via the dashboard.',
                  img: img_5,
                  alt: 'Admin reviewing analytics dashboard',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300"
                >
                  <img
                    src={step.img}
                    alt={step.alt}
                    className="w-32 h-32 object-cover rounded-lg mb-4 shadow-md"
                  />
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">{`${idx + 1}. ${step.step}`}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
 */}
        {/* Get Started */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Get Started Today</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover the future of communication with VoiceMate AI. Reach out to see how we can elevate your Telegram experience.
          </p>
          <a
            href="mailto:info@voicemate.ai"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;