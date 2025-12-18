import { useRef, useState } from 'react';

/**
 * TiltCard - A reusable component that adds 3D tilt effect on hover
 * @param {Object} props
 * @param {React.ReactNode} children - Child elements
 * @param {string} className - Additional CSS classes
 * @param {number} tiltAmount - Maximum tilt angle in degrees (default: 15)
 * @param {number} scale - Scale on hover (default: 1.02)
 * @param {boolean} glare - Enable glare effect (default: true)
 * @param {string} glareColor - Glare color (default: 'rgba(255, 255, 255, 0.2)')
 * @param {boolean} disabled - Disable tilt effect (default: false)
 */
const TiltCard = ({
  children,
  className = '',
  tiltAmount = 15,
  scale = 1.02,
  glare = true,
  glareColor = 'rgba(255, 255, 255, 0.2)',
  disabled = false,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({});

  const handleMouseMove = (e) => {
    if (disabled) return;
    
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation values
    const rotateY = ((mouseX - cardWidth / 2) / cardWidth) * tiltAmount;
    const rotateX = -((mouseY - cardHeight / 2) / cardHeight) * tiltAmount;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.1s ease-out'
    });

    // Update glare position
    if (glare) {
      const glareX = (mouseX / cardWidth) * 100;
      const glareY = (mouseY / cardHeight) * 100;
      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}, transparent 60%)`,
        opacity: 1
      });
    }
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out'
    });
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
      {glare && (
        <div 
          className="tilt-glare"
          style={glareStyle}
        />
      )}
    </div>
  );
};

export default TiltCard;
