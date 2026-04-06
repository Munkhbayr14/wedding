import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rot: number;
  rotSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  color: string;
  opacity: number;
  tilt: number;
}

const PETAL_COLORS = [
  "rgba(255,182,193,",
  "rgba(255,160,170,",
  "rgba(255,200,210,",
  "rgba(240,150,160,",
  "rgba(255,220,225,",
];

function createPetal(canvasW: number, canvasH: number): Petal {
  return {
    x: Math.random() * canvasW,
    y: Math.random() * -canvasH,
    size: Math.random() * 10 + 6,
    speedY: Math.random() * 0.4 + 0.2, // 1.2+0.6 → 0.4+0.2 (удаан)
    speedX: Math.random() * 0.3 - 0.15, // 0.6-0.3 → 0.3-0.15 (удаан)
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02, // 0.04 → 0.02 (аажим эргэлт)
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.015 + 0.005, // 0.03+0.01 → 0.015+0.005
    wobbleAmp: Math.random() * 0.8 + 0.3, // 1.5+0.5 → 0.8+0.3 (бага хэлбэлзэл)
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    opacity: Math.random() * 0.4 + 0.5,
    tilt: Math.random() * 0.8 - 0.4,
  };
}
function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(1, 1 + Math.sin(p.tilt) * 0.3);

  const s = p.size;

  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.9, s * 0.2, 0, s * 0.5);
  ctx.bezierCurveTo(-s * 0.9, s * 0.2, -s * 0.8, -s * 0.6, 0, -s);
  ctx.fillStyle = p.color + p.opacity + ")";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -s * 0.9);
  ctx.bezierCurveTo(s * 0.15, 0, s * 0.05, s * 0.3, 0, s * 0.45);
  ctx.strokeStyle = p.color + p.opacity * 0.4 + ")";
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.restore();
}

const SakuraFalling = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let petals: Petal[] = [];

    const resize = () => {
      if (!canvas.offsetWidth || !canvas.offsetHeight) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      petals = Array.from({ length: 12 }, () =>
        createPetal(canvas.offsetWidth, canvas.offsetHeight),
      );
    };

    let wind = 0;
    let windTarget = 0;
    let windTimer = 0;

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      windTimer++;
      if (windTimer > 180) {
        windTarget = (Math.random() - 0.5) * 0.8;
        windTimer = 0;
      }
      wind += (windTarget - wind) * 0.005;

      for (const p of petals) {
        p.wobble += p.wobbleSpeed;
        p.rot += p.rotSpeed + wind * 0.1;
        p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmp + wind;
        p.y += p.speedY;

        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;

        drawPetal(ctx, p);
      }

      animFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);

    animFrameId = requestAnimationFrame(() => {
      resize();
      animate();
    });

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};

export default SakuraFalling;
