import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cards from "./components/cards";
import { useCart } from "./components/context";
import axios from "axios";
import TopComponent from "./components/TopComponent";
import { div } from "framer-motion/client";

function App() {
  const [activeSection, setActiveSection] = useState("");
  const { cart, setCart, navigate, products, setProducts, loading } = useCart();
  const [count, setCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);

  function handleNavigate() {
    navigate("/varoq");
  }


  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarFixed(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    products[0]?.categories?.forEach(category => {
      const element = document.getElementById(category);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [products]);

  const filteredProducts = products.map(product => ({
    ...product,
    items: product.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    (

      loading ? <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>;
      </> :
        <div className="bg-gray-900 text-white min-h-screen">

          <div className="flex flex-col">
            <div className="w-full h-[60px] bg-gray-900 flex items-center justify-center">
              <TopComponent />
            </div>

            <div className="h-[120px] w-full"></div> 

            {/* Navigation Bar */}
            <motion.nav
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`w-full bg-gray-800 p-5  shadow-lg z-50 transition-all ${isNavbarFixed ? "fixed top-0 left-0" : "relative"
                }`}
            >
              {/* Scrollable Container */}
              <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex gap-4 px-4">
                  {products.length > 0 &&
                    products[0]?.categories?.map((category, index) => (
                      <a
                        key={index}
                        href={`#${category}`}
                        className={` text-[15px] transition 
              ${activeSection === category
                            ? "underline font-bold text-center relative bottom-[5px] px-[10px] py-[5px] rounded-[10px] bg-green-600"
                            : "text-white"
                          }
            `}
                      >
                        {category}
                      </a>
                    ))}
                </div>
              </div>
            </motion.nav>
          </div>


          {/* Search Bar */}
          <div className={`w-full flex justify-center  text-white p-4 ${isNavbarFixed ? "mt-[60px]" : ""}`}>
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-lg  w-[300px] outline-none"
            />
          </div>

          {/* 🔹 Show Loading Indicator */}
          {loading ? (
            <></>
          ) : (
            filteredProducts.length > 0 &&
            filteredProducts[0]?.categories?.map((category, index) => {
              const filteredItems = filteredProducts[0]?.items?.filter((item) => item.category === category  && item.isAviable);

              return (
                <motion.section
                  key={index}
                  id={category}
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
                    {category}
                  </motion.h2>

                  {filteredItems.length > 0 ? (
                    <Cards
                      section={{
                        category,
                        items: filteredItems,
                      }}
                      cart={cart}
                      count={count}
                      setCount={setCount}
                      setCart={setCart}
                    />
                  ) : (
                    <p className="text-gray-400">No items found for this category.</p>
                  )}
                </motion.section>
              );
            })
          )}

          {cart.length > 0 && (
            <div className="relative">
              <button
            className="text-white bg-[#229ED9] w-full max-w-[350px] fixed bottom-1 left-1/2 -translate-x-1/2 py-3 rounded-lg text-base font-semibold sm:text-sm"

              // className="text-white text-[20px] sm:text-[15px] bg-[#229ED9] w-full max-w-[350px] fixed bottom-0 left-1/2 transform -translate-x-1/2 py-3 rounded-lg text-lg font-semibold"
              onClick={handleNavigate}
            >
              Buyurtmalar
            </button>
              </div>
          )}
        </div>
    )


  );
}

export default App;
