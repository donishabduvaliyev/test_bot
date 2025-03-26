import React from "react";
import { FaStar } from "react-icons/fa";

const TopComponent = () => {
    return (
        <div className="relative w-full ">
            {/* Background Image */}
            <div
                className="w-full h-[200px] bg-cover bg-center relative overflow-hidden "
                style={{
                    backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/026/445/221/small_2x/grilled-beef-burger-with-cheese-fries-and-tomato-on-bun-generated-by-ai-free-photo.jpg')`,
                    backgroundPosition: "center bottom",
                }}
            >
                {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
                {/* <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-black/80 to-transparent"></div> */}
                <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-gray-800/100 to-transparent"></div>
                {/* <div className="absolute inset-x-0 bottom-0 h-[80px] backdrop-blur-md bg-white/10"></div> */}
            </div>

            {/* Content Box */}
            <div className="absolute top-[120px] left-4 sm:left-6 text-white w-[90%]">
                <h1 className="text-2xl sm:text-3xl font-bold">Test</h1>
                <p className="text-sm sm:text-lg">Restaurant</p>

                {/* Rating Section */}
                <div className="flex items-center mt-1 text-sm sm:text-base">
                    <FaStar className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-1 font-semibold">5.0</span>
                    <span className="text-gray-300 ml-1">(100+)</span>
                </div>

                {/* Delivery & Takeout */}
                <p className="text-green-400 font-semibold text-sm sm:text-base mt-1">Delivery, Takeout</p>

                {/* Description */}
                <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-tight">
                    Bu test Restaurant buyurtmalari uchun telegram bot.
                </p>
            </div>
        </div>
    );
};

export default TopComponent;
