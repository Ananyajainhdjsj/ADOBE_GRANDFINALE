import React, { useState, useEffect, useRef } from "react";
import ScrollFloat from "../components/ui/ScrollFloat";
import ScrollReveal from "../components/ui/ScrollReveal";

const Home = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
            // Clear any existing timeout to debounce rapid scroll events
            if (scrollTimeout.current) {
              clearTimeout(scrollTimeout.current);
            }

            // Set the scroll direction with a small delay to smooth out the animation
            scrollTimeout.current = setTimeout(() => {
              setIsScrollingUp(currentScrollY < lastScrollY.current);
            }, 50);

            lastScrollY.current = currentScrollY;
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const Squares = ({
    direction = "right",
    speed = 1,
    borderColor = "#9ca3af",
    squareSize = 80,
    hoverFillColor = "#d1d5db"
  }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const numSquaresX = useRef(0);
    const numSquaresY = useRef(0);
    const gridOffset = useRef({ x: 0, y: 0 });
    const hoveredSquareRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
        numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      const drawGrid = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const startX =
          Math.floor(gridOffset.current.x / squareSize) * squareSize;
        const startY =
          Math.floor(gridOffset.current.y / squareSize) * squareSize;

        for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
          for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
            const squareX = x - (gridOffset.current.x % squareSize);
            const squareY = y - (gridOffset.current.y % squareSize);

            if (
              hoveredSquareRef.current &&
              Math.floor((x - startX) / squareSize) ===
                hoveredSquareRef.current.x &&
              Math.floor((y - startY) / squareSize) ===
                hoveredSquareRef.current.y
            ) {
              ctx.fillStyle = hoverFillColor;
              ctx.fillRect(squareX, squareY, squareSize, squareSize);
            }

            ctx.strokeStyle = borderColor;
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
          }
        }
      };

      const updateAnimation = () => {
        const effectiveSpeed = Math.max(speed, 0.1);
        switch (direction) {
          case "right":
            gridOffset.current.x =
              (gridOffset.current.x - effectiveSpeed + squareSize) %
              squareSize;
            break;
          case "left":
            gridOffset.current.x =
              (gridOffset.current.x + effectiveSpeed + squareSize) %
              squareSize;
            break;
          case "up":
            gridOffset.current.y =
              (gridOffset.current.y + effectiveSpeed + squareSize) %
              squareSize;
            break;
          case "down":
            gridOffset.current.y =
              (gridOffset.current.y - effectiveSpeed + squareSize) %
              squareSize;
            break;
          case "diagonal":
            gridOffset.current.x =
              (gridOffset.current.x - effectiveSpeed + squareSize) %
              squareSize;
            gridOffset.current.y =
              (gridOffset.current.y - effectiveSpeed + squareSize) %
              squareSize;
            break;
          default:
            break;
        }

        drawGrid();
        requestRef.current = requestAnimationFrame(updateAnimation);
      };

      const handleMouseMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX < 0 || mouseY < 0 || mouseX > canvas.width || mouseY > canvas.height) {
          hoveredSquareRef.current = null;
          return;
        }

        const startX =
          Math.floor(gridOffset.current.x / squareSize) * squareSize;
        const startY =
          Math.floor(gridOffset.current.y / squareSize) * squareSize;

        const hoveredSquareX = Math.floor(
          (mouseX + gridOffset.current.x - startX) / squareSize
        );
        const hoveredSquareY = Math.floor(
          (mouseY + gridOffset.current.y - startY) / squareSize
        );

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== hoveredSquareX ||
          hoveredSquareRef.current.y !== hoveredSquareY
        ) {
          hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
        }
      };

      const handleGlobalMouseMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        handleMouseMove({ clientX: event.clientX, clientY: event.clientY });
      };

      const handleMouseLeave = () => {
        hoveredSquareRef.current = null;
      };

      // Listen for mouse events globally
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      requestRef.current = requestAnimationFrame(updateAnimation);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [direction, speed, borderColor, hoverFillColor, squareSize]);

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full border-none block"
      ></canvas>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background squares layer */}
      <div className="fixed inset-0" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <Squares
          direction="diagonal"
          speed={0.2}
          borderColor="rgba(156, 163, 175, 0.3)"
          squareSize={80}
          hoverFillColor="rgba(209, 213, 219, 0.3)"
        />
      </div>

   

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="text-center relative z-10 px-4 max-w-4xl mx-auto mt-[13vh]">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white leading-tight animate-blurSlideUp">
            PDF Insights
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 animate-blurSlideUp leading-relaxed">
            Intelligent document analysis powered by AI. Transform your PDFs into
            actionable insights.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Fixed Header with Scroll Animation */}
          <div className="sticky top-0 py-6 z-50 w-full flex justify-center">
            <div className="relative w-full max-w-xl flex justify-center items-center px-8 py-4">
              <ScrollFloat>
                <h2 
                  className="text-4xl md:text-5xl font-extrabold text-center tracking-wider whitespace-nowrap"
                  style={{
                    color: '#1f2937',
                    padding: '2rem 1rem'
                  }}
                >
                  Key Features
                </h2>
              </ScrollFloat>
            </div>
          </div>
          <div className="relative min-h-[1200px] max-w-2xl mx-auto perspective-1000">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Smart Analysis",
                description: "Advanced AI algorithms analyze your PDFs for deeper insights and understanding.",
                color: "from-blue-500 to-blue-600",
                offset: 100,
                zIndex: 0
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Text-to-Speech",
                description: "Convert your PDF content into natural-sounding speech for accessibility.",
                color: "from-emerald-500 to-emerald-600",
                offset: 250,
                zIndex: 5
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Smart Search",
                description: "Efficiently search through your PDFs with our advanced search capabilities.",
                color: "from-purple-500 to-purple-600",
                offset: 400,
                zIndex: 10
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                ref={el => {
                  if (!el) return;
                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting) {
                        setTimeout(() => {
                          el.style.opacity = '1';
                          el.style.transform = 'translateY(0) scale(1)';
                          el.style.pointerEvents = 'auto';
                        }, index * 200);
                        observer.disconnect();
                      }
                    },
                    {
                      threshold: 0.1,
                      rootMargin: "-10% 0px -10% 0px"
                    }
                  );
                  observer.observe(el);
                }}
                className={`sticky p-8 rounded-2xl backdrop-blur-md shadow-xl transform will-change-transform hover:scale-105`}
                style={{
                  top: '100px',
                  opacity: 0,
                  transform: 'translateY(100px) scale(0.95)',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginTop: `${index * 20}px`,
                  zIndex: feature.zIndex,
                  height: '240px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${feature.color.includes('blue') ? '#3b82f6' : 
                          feature.color.includes('emerald') ? '#10b981' : '#8b5cf6'}`
                }}
              >
                <div className={`w-16 h-16 flex items-center justify-center mb-6 rounded-xl bg-white/5`}>
                  {feature.icon}
                </div>
                <h3 
                  className="text-2xl font-bold mb-3 drop-shadow-sm"
                  style={{
                    background: feature.color.includes('blue') ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                              feature.color.includes('emerald') ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                              'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >{feature.title}</h3>
                <p 
                  className="text-lg leading-relaxed font-medium"
                  style={{
                    color: feature.color.includes('blue') ? '#60a5fa' : 
                           feature.color.includes('emerald') ? '#34d399' : 
                           '#a78bfa'
                  }}
                >{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

     

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/20 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400">
              © 2025 PDF Insights. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
