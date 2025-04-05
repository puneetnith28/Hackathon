import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Notes.css";
// eslint-disable-next-line no-unused-vars
import ProjectSuggestions from "./ProjectSuggestions";
// eslint-disable-next-line no-unused-vars
import CareerGuidance from "./CareerGuidance";

const Notes = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "🌟 Welcome to the Our Portal! I'm your magical assistant, ready to help you on your coding journey. What mysteries shall we unravel today? 🌟",
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const avatarRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    if (avatarRef.current) {
      avatarRef.current.classList.add("casting-spell");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.local.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful and playful AI assistant in a magical coding realm. Respond in an adventurous, slightly wizardly tone.",
          },
          ...messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          { role: "user", content: inputText },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`🧨 API call failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const aiMessage = {
      id: messages.length + 2,
      text: data.choices[0].message.content,
      sender: "ai",
    };
    try {    

      if (data.suggestions?.length > 0) {
        const suggestionMessage = {
          id: messages.length + 3,
          text: data.suggestions.join("\n"),
          sender: "ai",
          type: "magical-scroll",
        };
        setMessages((prev) => [...prev, aiMessage, suggestionMessage]);
      } else {
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      if (error) {
        console.error("Connection failed:", error);
        const errorMessage = {
          id: messages.length + 2,
          text: "🌋 The mystical connection was lost! Let's try again, brave adventurer.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
      if (avatarRef.current) {
        avatarRef.current.classList.remove("casting-spell");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-container" ref={chatContainerRef}>
        <div className="notes-header">
          <div className="avatar-crystal" ref={avatarRef}>
            <div className="magical-aura"></div>
            <div className="crystal-core"></div>
          </div>

          <div className="quest-board">
            <button
              className="quest-btn glow-effect"
              onClick={() => navigate("/project-suggestions")}
            >
              <span className="quest-icon bounce">🎯</span>
              <span>Quests</span>
            </button>

            <button
              className="quest-btn glow-effect"
              onClick={() => navigate("/career-guidance")}
            >
              <span className="quest-icon swing">⚔️</span>
              <span>Journey</span>
            </button>

            <button className="quest-btn glow-effect">
              <span className="quest-icon pulse">🔮</span>
              <span>History</span>
            </button>
          </div>
        </div>

        <div className="notes-divider" />

        <div className="notes-list custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`note-item fade-in ${
                message.sender === "user" ? "note-right" : "note-left"
              }`}
            >
              <div
                className={`message ${message.sender} ${message.type || ""}`}
              >
                {message.text.split("\n").map((line, i) => (
                  <div key={i} className="message-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="note-item typing fade-in">
              <div className="casting-indicator">
                <span className="sparkle">🌟</span>
                <span className="sparkle delay-1">💫</span>
                <span className="sparkle delay-2">⭐</span>
              </div>
            </div>
          )}
        </div>

        <div className="note-input floating">
          <textarea
            className="note-textarea custom-scrollbar"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="✨ Whisper your thoughts into the magical realm..."
            rows="2"
          />
          <button
            className="add-note-btn pulse-effect"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <span className="btn-text">Cast</span>
            <span className="btn-icon">🌠</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
