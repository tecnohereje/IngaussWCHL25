import React from 'react';

interface MarqueeProps {
  texts: string[];
}

const Marquee: React.FC<MarqueeProps> = ({ texts }) => {
  // We duplicate the content for a smooth, infinite loop effect
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