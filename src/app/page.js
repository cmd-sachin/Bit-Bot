"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import Markdown from "markdown-to-jsx";
import {
  Send,
  Loader2,
  AlertCircle,
  Home,
  BookOpen,
  User, // Using User in place of IdBadge
  Grid,
  BarChart,
} from "lucide-react";

// Chat message component
const ChatMessage = ({ message }) => (
  <div
    className={`flex ${
      message.role === "user" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <div
      className={`max-w-[70%] p-4 rounded-xl shadow-md ${
        message.role === "user"
          ? "bg-blue-500 text-white ml-auto"
          : "bg-white text-gray-800 mr-auto"
      }`}
    >
      <Markdown className="prose prose-sm max-w-none">
        {message.content}
      </Markdown>
    </div>
  </div>
);

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
      style={{ animationDelay: "0.4s" }}
    ></div>
  </div>
);

// Innovative section that rotates through tips
const InnovativeSection = () => {
  const tips = [
    "Did you know? BIT offers world-class education!",
    "Tip: Explore BIT's innovative research labs.",
    "Stay updated with campus events via BIT websites.",
    "Remember to check out the latest BIT news on the dashboard!",
  ];
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
      <p>{tips[currentTip]}</p>
    </div>
  );
};

export default function Chat() {
  const [selectedOption, setSelectedOption] = useState("gemini-1.5-flash");
  const [displayError, setDisplayError] = useState(null);
  const messagesEndRef = useRef(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      experimental_prepareRequestBody: (payload) => ({
        messages: payload.messages,
        selectedOption: selectedOption,
      }),
      onError: (error) => {
        console.error("Chat error:", error);
        setDisplayError(error.message);
      },
      onResponse: (response) => {
        console.log("Response:", response);
      },
    });

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, displayError]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setDisplayError(null);
      try {
        await handleSubmit(e);
      } catch (error) {
        console.error("Submission error:", error);
        setDisplayError(
          error.message || "An error occurred while sending your message."
        );
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with BIT Website Links & Innovative Section */}
      <aside className="w-64 bg-white p-6 border-r border-gray-200 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">BIT Websites</h2>
          <nav className="flex flex-col space-y-3">
            <a
              href="https://www.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>
            <a
              href="https://wiki.bitsathy.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Wiki Page</span>
            </a>
            <a
              href="https://www.camps.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Camps</span>
            </a>
            <a
              href="https://bip.bitsathy.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
              <Grid className="w-5 h-5" />
              <span>BIP Dashboard</span>
            </a>
            <a
              href="https://ps.bitsathy.ac.in/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
              <BarChart className="w-5 h-5" />
              <span>PS Portal</span>
            </a>
          </nav>
        </div>
        <InnovativeSection />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="BIT logo" className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-gray-800">BIT BOT</h1>
          </div>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro Latest</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
          </select>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-100 to-gray-200">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isLoading && <TypingIndicator />}
          {displayError && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
              role="alert"
            >
              <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
              <span className="sr-only">Error</span>
              <div>
                <span className="font-medium">Error:</span> {displayError}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="p-4 bg-white border-t border-gray-200"
        >
          <div className="flex space-x-4 items-center">
            <input
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about BIT..."
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
