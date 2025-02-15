import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cards from "./components/cards";
import { sections } from "./data";

function App() {
  const [activeSection, setActiveSection] = useState("");
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();




  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");

  const sendMessageToBot = () => {
    fetch("http://localhost:5000/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Message sent successfully!");
        } else {
          console.error("Error:", data.error);
        }
      })
      .catch((err) => console.error("Error:", err));
  };





  // ✅ Check if Telegram WebApp is available
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      alert("Telegram WebApp detected:", window.Telegram);
    } else {
      alert("Telegram WebApp is not available!");
    }
  }, []);

  // ✅ Send Message to Telegram Bot only ONCE (on mount)
  useEffect(() => {
    fetch("http://localhost:5000/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: "YOUR_CHAT_ID", message: "Hello from React!" }),
    })
      .then(res => res.json())
      .then(data => console.log("Message sent:", data))
      .catch(err => console.error("Error sending message:", err));
  }, []);

  // ✅ Intersection Observer for tracking active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]); // Added `sections` as a dependency

  // ✅ Telegram Web App Integration
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (!tg) return;

    tg.expand(); // Expands the web app to full screen

    // Set up the main button
    tg.MainButton.setText(`Go to Checkout ${cart}`);
    tg.MainButton.hide(); // Hide by default

    const handleMainButtonClick = () => {
      navigate("adressInfo");
    };

    tg.MainButton.onClick(handleMainButtonClick);

    return () => {
      tg.MainButton.offClick(handleMainButtonClick); // Cleanup on unmount
    };
  }, [navigate]);

  // ✅ Show/Hide Telegram Main Button based on cart content
  useEffect(() => {
    console.log("Cart updated:", cart);

    const tg = window.Telegram.WebApp;
    if (!tg) return;

    if (cart.length > 0) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [cart]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-center shadow-lg gap-3"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`text-yellow-400 text-[15px] transition ${activeSection === section.id ? "underline font-bold" : ""
              }`}
          >
            {section.title}
          </a>
        ))}
      </motion.nav>

      {/* Sections with Animations */}
      {sections.map((section) => (
        <motion.section
          key={section.id}
          id={section.id}
          className="min-h-screen flex flex-col items-center justify-center p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {section.title}
          </motion.h2>

          <Cards
            section={section}
            cart={cart}
            count={count}
            setCount={setCount}
            setCart={setCart}
          />
        </motion.section>
      ))}
    </div>
  );
}

export default App;
