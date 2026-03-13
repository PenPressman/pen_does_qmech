// Animated interference pattern for hero background
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId;
  let t = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const imageData = ctx.createImageData(W, H);
    const d = imageData.data;

    // Two-slit interference pattern
    const s1x = W * 0.35, s1y = H * 0.45;
    const s2x = W * 0.35, s2y = H * 0.55;
    const lambda = 90;
    const speed = 0.8;

    for (let j = 0; j < H; j += 2) {
      for (let i = W * 0.3; i < W; i += 2) {
        const r1 = Math.sqrt((i - s1x) ** 2 + (j - s1y) ** 2);
        const r2 = Math.sqrt((i - s2x) ** 2 + (j - s2y) ** 2);
        const phase1 = (2 * Math.PI * r1) / lambda - t * speed;
        const phase2 = (2 * Math.PI * r2) / lambda - t * speed;
        const amp = (Math.sin(phase1) / Math.sqrt(Math.max(r1, 1)) +
                     Math.sin(phase2) / Math.sqrt(Math.max(r2, 1)));
        const intensity = Math.min(Math.abs(amp) * 28, 1);
        const falloff = Math.max(0, (i - W * 0.3) / (W * 0.7));
        const v = intensity * falloff * 0.7;

        const idx = (j * W + i) * 4;
        const idx2 = ((j + 1) * W + i) * 4;
        // Purple-blue interference
        const r = Math.round(v * 80);
        const g = Math.round(v * 60);
        const b = Math.round(v * 180);
        const a = Math.round(v * 200);
        d[idx] = r; d[idx+1] = g; d[idx+2] = b; d[idx+3] = a;
        d[idx+1*4] = r; d[idx+1*4+1] = g; d[idx+1*4+2] = b; d[idx+1*4+3] = a;
        if (j + 1 < H) { d[idx2] = r; d[idx2+1] = g; d[idx2+2] = b; d[idx2+3] = a; }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Incident wave lines (left side)
    for (let k = 0; k < 8; k++) {
      const x = (W * 0.05) + ((t * 0.5 + k * 60) % (W * 0.32));
      const alpha = 0.04 + 0.03 * Math.sin(x / 20);
      ctx.strokeStyle = `rgba(127,119,221,${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Slit indicator
    ctx.strokeStyle = 'rgba(127,119,221,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W * 0.35, 0); ctx.lineTo(W * 0.35, H * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * 0.35, H * 0.47); ctx.lineTo(W * 0.35, H * 0.53); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * 0.35, H * 0.6); ctx.lineTo(W * 0.35, H); ctx.stroke();

    t += 0.04;
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  draw();
})();
