
import { useEffect, useState } from "react";

export default function AuthLayout({ children }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Generate random but safe positions
    const newPositions = Array(3).fill(0).map(() => ({
      top: `${Math.random() * 70 + 10}%`,
      left: `${Math.random() * 70 + 10}%`,
    }));
    setPositions(newPositions);
  }, []);


  return (
    <div className="max-w-screen h-screen flex bg-[#F5EFE6] relative overflow-y-hidden">
      {/* Decorative floating images - shared for all devices */}


      {/* Left side: form */}
      <div className="z-10 w-full h-full md:w-1/2 flex flex-col justify-center items-center p-6">
        {children}
      </div>

      {/* Right side: motivational text (desktop only) */}
      <div className="hidden md:flex w-1/2 justify-center items-center relative z-20">
        <p className="text-6xl font-Glitten text-center leading-snug">
          Knowledge Shared,
          <br />
          Wisdom Gained.
        </p>
      </div>
    </div>
  );
}
