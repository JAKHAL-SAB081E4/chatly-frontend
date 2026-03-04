

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    setInput("");

    try {
      const response = await axios.get(
         `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          params: { message: input }
        }
        );
      const botReply = response?.data?.reply || "No response from server";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply },
      ]);
    } catch (error) {
       console.log("FULL ERROR:", error.response?.data || error.message);


      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to server." },
      ]);
    }
 

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>CHATLY</h2>

      <div style={styles.chatBox}>
        {messages.length === 0 && !loading && (
         <div style={styles.emptyState}>
         <h2 style={styles.welcomeTitle}>Welcome to Chatly 👋</h2>
         <p style={styles.welcomeText}>
          Ask me anything about React, MERN, or programming.
         </p>
         </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user"
                ? styles.userMessage
                : styles.botMessage
            }
          >
           {msg.sender === "bot" ? (
             <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                   msg.text
                  )}
          </div>
        ))}

        {loading && (
        <div style={styles.botMessage}>
         <span className="typing-dot"></span>
         <span className="typing-dot"></span>
         <span className="typing-dot"></span>
        </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

// const styles = {
//   container: {
//     width: "1300px",
//     margin: "40px auto",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     display: "grid",
//     gridTemplateRows: "auto 1fr auto",
//     height: "550px",
//     fontFamily: "Times New Roman, serif",
//   },
//   title: {
//     textAlign: "center",
//     padding: "10px",
//     background: "#f5f5f5",
//     margin: 0,
//   },

// chatBox: {
//     backgroundColor: "#ffffff",
//     padding: "20px",
//     borderRadius: "15px",
//     boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
//     marginBottom: "20px",
//     maxHeight: "400px",
//     overflowY: "auto"
//   },
//   userMessage: {
//     alignSelf: "flex-end",
//     background: "#d1e7ff",
//     padding: "8px",
//     borderRadius: "10px",
//     margin: "5px 0",
//     maxWidth: "70%",
//   },
//   botMessage: {
//     alignSelf: "flex-start",
//     background: "#eaeaea",
//     padding: "8px",
//     borderRadius: "10px",
//     margin: "5px 0",
//     maxWidth: "70%",
//   },
//   inputContainer: {
//     display: "flex",
//     padding: "10px",
//     borderTop: "1px solid #ddd",
//   },
//   input: {
//     flex: 1,
//     padding: "8px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     marginLeft: "5px",
//     padding: "8px 12px",
//     borderRadius: "5px",
//     border: "none",
//     background: "#007bff",
//     color: "white",
//     cursor: "pointer",
//   },
// };

const styles = {
  container: {
    width: "100%",
    maxWidth: "1100px",
    height: "90vh",
    margin: "30px auto",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', sans-serif",
  },

  title: {
    textAlign: "center",
    padding: "15px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    color: "white",
    margin: 0,
    fontSize: "20px",
    letterSpacing: "2px",
  },

  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "rgba(255,255,255,0.05)",
  },

  userMessage: {
    alignSelf: "flex-end",
    background: "#ffffff",
    color: "#333",
    padding: "12px 18px",
    borderRadius: "20px 20px 5px 20px",
    maxWidth: "70%",
    fontSize: "14px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  botMessage: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.85)",
    color: "#333",
    padding: "12px 18px",
    borderRadius: "20px 20px 20px 5px",
    maxWidth: "70%",
    fontSize: "14px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  inputContainer: {
    display: "flex",
    padding: "15px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "30px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "12px 20px",
    borderRadius: "30px",
    border: "none",
    background: "#ffffff",
    color: "#764ba2",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s ease",
  },
  emptyState: {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  opacity: 0.9,
},

welcomeTitle: {
  fontSize: "28px",
  marginBottom: "10px",
  fontWeight: "600",
},

welcomeText: {
  fontSize: "16px",
  maxWidth: "400px",
  lineHeight: "1.6",
},
};

export default Chatbot;