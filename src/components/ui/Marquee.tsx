import React from 'react';

interface MarqueeProps {
  texts: string[];
}

const Marquee: React.FC<MarqueeProps> = ({ texts }) => {
  // Duplicamos el contenido para un efecto de bucle infinito y suave
  const marqueeContent = [...texts, ...texts];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {marqueeContent.map((text, index) => (
          <span key={index} className="marquee-item">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;