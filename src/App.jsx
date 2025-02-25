import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cards from "./components/cards";
// import { sections } from "./data";
import { useCart } from "./components/context";
import { button, section } from "framer-motion/client";
import axios from "axios";

function App() {
  const [activeSection, setActiveSection] = useState("");
  const { cart, setCart, navigate, products } = useCart();
  const [count, setCount] = useState(1);
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");

  function handleNavigate() {
    navigate("/varoq");

  }
 let  sections = products

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
  }, [sections]);

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
            className={`text-yellow-400 text-[15px]  transition ${activeSection === section.id ? "underline font-bold" : ""
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
          className="min-h-screen flex mt-[50px] flex-col items-center justify-center p-8"
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


      {
        cart.length > 0 ? <button className="text-white text-[50px] bg-[#229ED9] w-[400px]" onClick={handleNavigate}>buyurtmalar</button> : ''
      }
    </div>
  );
}

export default App;
