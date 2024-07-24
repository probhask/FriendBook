import React, { useState, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

const GoToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 400px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 40) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the listener
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div
          className="fixed bottom-5 right-5 cursor-pointer bg-[#007bff] text-white w-10 h-10 flex justify-center items-center rounded-full z-50 transition-opacity hover:opacity-80"
          onClick={scrollToTop}
        >
          <FaArrowCircleUp className="text-xl" />
        </div>
      )}
    </>
  );
};

export default GoToTopButton;
