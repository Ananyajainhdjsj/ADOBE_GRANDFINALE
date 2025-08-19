import React, { useEffect, useRef, useState } from "react";

const ScrollFloat = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 } // trigger when 20% visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transform transition-all duration-700 ease-out inline-block w-full flex items-center justify-center"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        opacity: isVisible ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollFloat;
