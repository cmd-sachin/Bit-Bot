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
  User,
  Grid,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Chat message component
const ChatMessage = ({ message }) => (
  <div
    className={`chat-message ${
      message.role === "user" ? "user-message" : "assistant-message"
    }`}
  >
    <div className="message-bubble">
      <Markdown className="message-content">{message.content}</Markdown>
    </div>
  </div>
);

// Typing indicator component
const TypingIndicator = () => (
  <div className="typing-indicator">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
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
    <div className="innovative-section">
      <p>{tips[currentTip]}</p>
    </div>
  );
};

export default function Chat() {
  const [selectedOption, setSelectedOption] = useState("gemini-1.5-flash");
  const [displayError, setDisplayError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="chat-container">
      {/* Sidebar with BIT Website Links & Innovative Section */}
      <aside className={`sidebar ${sidebarVisible ? "visible" : "hidden"}`}>
        <div className="sidebar-content">
          <h2 className="sidebar-title">BIT Websites</h2>
          <nav className="sidebar-nav">
            <a
              href="https://www.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <Home className="nav-icon" />
              <span>Home</span>
            </a>
            <a
              href="https://www.wiki.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <BookOpen className="nav-icon" />
              <span>Wiki Page</span>
            </a>
            <a
              href="https://www.camps.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <User className="nav-icon" />
              <span>Camps</span>
            </a>
            <a
              href="https://www.bip.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <Grid className="nav-icon" />
              <span>BIP Dashboard</span>
            </a>
            <a
              href="https://www.ps.bitsathy.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              <BarChart className="nav-icon" />
              <span>PS Portal</span>
            </a>
          </nav>
        </div>
        <InnovativeSection />
      </aside>

      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarVisible ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="app-header">
          <div className="header-branding">
            <img src="/logo.png" alt="BIT logo" className="logo" />
            <h1 className="app-title">BIT BOT</h1>
          </div>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="model-selector"
          >
            <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro Latest</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
          </select>
        </header>

        <div className="chat-messages">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isLoading && <TypingIndicator />}
          {displayError && (
            <div className="error-message" role="alert">
              <AlertCircle className="error-icon" />
              <span className="sr-only">Error</span>
              <div>
                <span className="error-label">Error:</span> {displayError}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleFormSubmit} className="message-form">
          <div className="input-container">
            <input
              className="message-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about BIT..."
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="button-icon spinning" />
              ) : (
                <Send className="button-icon" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
