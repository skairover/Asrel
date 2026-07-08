import Image from "next/image";
import notebook from "/closed-notebook.png";
import ebook from "/E-ink-tablet.png";
import openedbook from "/opened-book-txt-img.png";
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

  const images = [notebook, ebook, openedbook];

  return (
    <div className="max-w-screen h-screen flex bg-[#F5EFE6] relative overflow-y-hidden">
      {/* Decorative floating images - shared for all devices */}
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute w-20 sm:w-24 md:w-28 opacity-50 "
          style={{
            top: positions[i]?.top,
            left: positions[i]?.left,
          }}
        >
          <Image src={img} alt="book icon"  width={100}
  height={100}/>
        </div>
      ))}

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
