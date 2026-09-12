'use client';

import React, { useEffect, useRef } from 'react';

export type VibeMode = 'cyber' | 'laser' | 'strobe' | 'fog';

export function PartyVibeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initial position centered
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 3;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 3;

    // Generate 3D floating luxury ambient shapes
    const shapesCount = 32;
    const shapes = Array.from({ length: shapesCount }, (_, i) => ({
      x: (Math.random() - 0.5) * width * 1.6,
      y: (Math.random() - 0.5) * height * 1.6,
      z: Math.random() * 750 + 150,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      vz: (Math.random() - 0.5) * 0.4,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      vRotX: (Math.random() - 0.5) * 0.02,
      vRotY: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 26 + 14,
      type: i % 3, // 0: wireframe cube, 1: ambient vinyl ring, 2: star
      colorType: i % 4, // 0: Royal Purple, 1: Deep Indigo, 2: Rich Amber/Gold, 3: Vibrant Rose
    }));

    let tick = 0;

    const render = () => {
      tick++;

      // Smooth cursor position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Dark Mode Ambient Canvas Flare around cursor/touch
      if (mouseRef.current.x > 0) {
        const centerGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          550
        );
        centerGlow.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
        centerGlow.addColorStop(0.4, 'rgba(79, 70, 229, 0.14)');
        centerGlow.addColorStop(0.8, 'rgba(217, 119, 6, 0.06)');
        centerGlow.addColorStop(1, 'rgba(11, 12, 16, 0)');
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // ── 3D FLOATING VIBRANT SHAPES ──
      const fov = 420;
      const cx = width / 2;
      const cy = height / 2;

      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.z += s.vz;
        s.rotX += s.vRotX;
        s.rotY += s.vRotY;

        if (s.x < -width) s.x = width;
        if (s.x > width) s.x = -width;
        if (s.y < -height) s.y = height;
        if (s.y > height) s.y = -height;
        if (s.z < 100) s.z = 850;
        if (s.z > 850) s.z = 100;

        const scale = fov / (fov + s.z);
        const projX = s.x * scale + cx;
        const projY = s.y * scale + cy;
        const projSize = s.size * scale;

        if (projX < -120 || projX > width + 120 || projY < -120 || projY > height + 120) return;

        ctx.save();
        ctx.translate(projX, projY);
        ctx.scale(scale, scale);

        // Luminous neon colors for dark mode
        const alpha = 0.5 + scale * 0.5;
        let strokeColor = `hsla(265, 95%, 68%, ${alpha})`;
        let shadowColor = 'rgba(168, 85, 247, 0.6)';

        if (s.colorType === 1) {
          strokeColor = `hsla(195, 95%, 62%, ${alpha})`;
          shadowColor = 'rgba(14, 165, 233, 0.6)';
        } else if (s.colorType === 2) {
          strokeColor = `hsla(38, 95%, 60%, ${alpha})`;
          shadowColor = 'rgba(245, 158, 11, 0.6)';
        } else if (s.colorType === 3) {
          strokeColor = `hsla(340, 95%, 65%, ${alpha})`;
          shadowColor = 'rgba(244, 63, 94, 0.6)';
        }

        ctx.strokeStyle = strokeColor;
        ctx.shadowColor = shadowColor;
        ctx.lineWidth = 1.8 / scale;
        ctx.shadowBlur = 12 * scale;

        if (s.type === 0) {
          // Wireframe cube with 3D projection lines
          const r = projSize;
          ctx.rotate(s.rotX);
          ctx.strokeRect(-r / 2, -r / 2, r, r);
          ctx.strokeRect(-r / 3, -r / 3, r, r);
          ctx.beginPath();
          ctx.moveTo(-r / 2, -r / 2); ctx.lineTo(-r / 3, -r / 3);
          ctx.moveTo(r / 2, -r / 2);  ctx.lineTo(r / 3 + r / 6, -r / 3);
          ctx.moveTo(-r / 2, r / 2);  ctx.lineTo(-r / 3, r / 3 + r / 6);
          ctx.moveTo(r / 2, r / 2);   ctx.lineTo(r / 3 + r / 6, r / 3 + r / 6);
          ctx.stroke();
        } else if (s.type === 1) {
          // Double concentric vinyl rings
          ctx.rotate(s.rotY + tick * 0.015);
          ctx.beginPath();
          ctx.arc(0, 0, projSize, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, projSize * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // 5-point star
          ctx.rotate(s.rotX);
          const pts = 5;
          ctx.beginPath();
          for (let p = 0; p < pts * 2; p++) {
            const rad = p % 2 === 0 ? projSize : projSize * 0.45;
            const a = (p * Math.PI) / pts;
            const px = Math.cos(a) * rad;
            const py = Math.sin(a) * rad;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();
      });

      // Sharp Light Mode Cursor Touch Flare
      if (mouseRef.current.x > 0) {
        ctx.save();
        const cursorGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          80
        );
        cursorGlow.addColorStop(0, 'rgba(124, 58, 237, 0.35)');
        cursorGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.18)');
        cursorGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.9 }}
    />
  );
}

