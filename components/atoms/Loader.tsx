import React from "react";
import Image from "next/image";
const AparteyLoader: React.FC = () => {
  return (
    <div className="logo-loader-container">
      <div className="logo-glow-wrapper animate-pulse">
        <Image src="/aparteyLogo.png" alt="Apartey Logo" width={180} height={180} />
        <div className="lightning-sweep"></div>
      </div>
    </div>
  );
};

export default AparteyLoader;
