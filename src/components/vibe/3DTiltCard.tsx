'use client';

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
  glowColor?: string;
}

export function TiltCard({
  children,
  className = '',
  maxRotate = 10,
  glowColor = 'rgba(168, 85, 247, 0.4)',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const percentX = (mouseX / width) * 100;
    const percentY = (mouseY / height) * 100;

    const rotX = (0.5 - mouseY / height) * maxRotate;
    const rotY = (mouseX / width - 0.5) * maxRotate;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({ x: percentX, y: percentY, opacity: 0.35 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative h-full w-full rounded-2xl overflow-hidden group">
        {/* Shiny specular holographic glare */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          }}
        />
        {children}
      </div>
    </div>
  );
}
