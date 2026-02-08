/**
 * Lightweight canvas confetti burst — zero dependencies.
 * Fires gold particles for "GRAIL FOUND" verdicts.
 */
export function fireConfetti(): void {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  const colors = ['#FFB020', '#2BF3C0', '#FF3BD4', '#9B7BFF', '#FFFFFF'];
  const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string; life: number }[] = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 4,
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    });
  }

  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravity
      p.life -= 0.012;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.r, p.r * 1.5);
    }
    frame++;
    if (alive && frame < 180) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  };
  requestAnimationFrame(animate);
}
