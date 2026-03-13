// Double-Slit Experiment
(function() {
  let mode = 'wave';
  let particles = [];
  let animId = null;
  let particleCount = 0;

  const eqs = {
    wave: 'I(θ) = I₀ · sinc²(πa sinθ/λ) · cos²(πd sinθ/λ)\nBright fringes: d sinθ = mλ   (m = 0,±1,±2,...)',
    particle: 'P(y) ∝ |ψ₁ + ψ₂|²  — interference of probability amplitudes\nEach particle "goes through both slits" — Feynman path integral',
    'which-way': 'Measuring which slit → collapses superposition → no interference\n"Which-way" information destroys the fringe pattern (complementarity)'
  };

  window.setMode = function(m, btn) {
    mode = m;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('eqbox').textContent = eqs[m];
    particles = []; particleCount = 0;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (m === 'particle') startParticles();
    else draw();
  };

  function getParams() {
    const wl = +document.getElementById('wl').value;
    const sep = +document.getElementById('sep').value;
    const sw = +document.getElementById('sw').value;
    document.getElementById('wl-v').textContent = wl;
    document.getElementById('sep-v').textContent = sep;
    document.getElementById('sw-v').textContent = sw;
    return { wl, sep, sw };
  }

  function sinc(x) { return x === 0 ? 1 : Math.sin(x) / x; }

  function interference(y, cy, sep, wl, slitW) {
    const s1y = cy - sep / 2, s2y = cy + sep / 2;
    const r1 = Math.sqrt(1 + (y - s1y) ** 2);
    const r2 = Math.sqrt(1 + (y - s2y) ** 2);
    const dR = r2 - r1;
    const phase = (2 * Math.PI * dR) / wl;
    const b1 = (Math.PI * slitW * (y - s1y)) / (wl * r1);
    const b2 = (Math.PI * slitW * (y - s2y)) / (wl * r2);
    const env = (sinc(b1) + sinc(b2)) / 2;
    return Math.max(0, Math.min(1, env * env * (1 + Math.cos(phase)) / 2));
  }

  window.draw = function() {
    if (mode === 'particle') return;
    const cvs = document.getElementById('c');
    const W = cvs.offsetWidth || 860; cvs.width = W * devicePixelRatio; cvs.height = 400 * devicePixelRatio;
    const ctx = cvs.getContext('2d'); ctx.scale(devicePixelRatio, devicePixelRatio);
    const H = 400;
    const { wl, sep, sw } = getParams();
    const barrierX = W * 0.35, screenX = W * 0.80, cy = H / 2;

    ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, W, H);

    // Incident wave
    for (let x = 20; x < barrierX - 2; x += 2) {
      for (let y = 0; y < H; y++) {
        const v = 0.5 + 0.5 * Math.sin((x * 2 * Math.PI) / wl - y * 0.008);
        ctx.fillStyle = `rgba(127,119,221,${0.18 * v})`;
        ctx.fillRect(x, y, 2, 1);
      }
    }

    // Barrier
    const slitTop1 = cy - sep / 2 - sw / 2, slitBot1 = cy - sep / 2 + sw / 2;
    const slitTop2 = cy + sep / 2 - sw / 2, slitBot2 = cy + sep / 2 + sw / 2;
    ctx.fillStyle = 'rgba(80,72,180,0.9)';
    ctx.fillRect(barrierX, 0, 7, slitTop1);
    ctx.fillRect(barrierX, slitBot1, 7, slitTop2 - slitBot1);
    ctx.fillRect(barrierX, slitBot2, 7, H - slitBot2);

    if (mode === 'which-way') {
      ctx.strokeStyle = '#d85a30'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      [cy - sep / 2, cy + sep / 2].forEach(sy => {
        ctx.beginPath(); ctx.arc(barrierX + 3, sy, 9, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.fillStyle = '#d85a30'; ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('detector', barrierX - 56, cy - sep / 2 - 14);
    }

    // Diffraction field
    for (let x = barrierX + 10; x < screenX - 4; x++) {
      const tProgress = (x - barrierX) / (screenX - barrierX);
      for (let y = 0; y < H; y++) {
        let alpha;
        if (mode === 'which-way') {
          const d1 = (y - (cy - sep / 2)) ** 2;
          const d2 = (y - (cy + sep / 2)) ** 2;
          const band = Math.exp(-d1 / 1400) + Math.exp(-d2 / 1400);
          alpha = 0.22 * tProgress * band * (0.5 + 0.5 * Math.sin((x * 2 * Math.PI) / wl));
          ctx.fillStyle = `rgba(216,90,48,${alpha})`;
        } else {
          const inten = interference(y, cy, sep, wl, sw);
          const wave = 0.5 + 0.5 * Math.sin((x * 2 * Math.PI) / wl);
          alpha = 0.5 * tProgress * inten * wave;
          ctx.fillStyle = `rgba(29,158,117,${alpha})`;
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Screen line
    ctx.strokeStyle = 'rgba(127,119,221,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, H); ctx.stroke();

    // Intensity curve
    ctx.beginPath();
    ctx.strokeStyle = mode === 'which-way' ? '#d85a30' : '#1d9e75';
    ctx.lineWidth = 2;
    for (let y = 0; y < H; y++) {
      let inten;
      if (mode === 'which-way') {
        const d1 = (y - (cy - sep / 2)) ** 2, d2 = (y - (cy + sep / 2)) ** 2;
        inten = Math.min(1, (Math.exp(-d1 / 1400) + Math.exp(-d2 / 1400)) * 0.75);
      } else {
        inten = interference(y, cy, sep, wl, sw);
      }
      const px = screenX + inten * 60;
      y === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();

    // Labels
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(127,119,221,0.7)'; ctx.fillText('source', 8, 18);
    ctx.fillStyle = 'rgba(80,72,180,0.7)'; ctx.fillText('barrier', barrierX + 10, 18);
    ctx.fillStyle = mode === 'which-way' ? 'rgba(216,90,48,0.7)' : 'rgba(29,158,117,0.7)';
    ctx.fillText('screen', screenX + 4, 18);
  };

  function sampleY(cy, sep, wl, sw, H) {
    for (let i = 0; i < 3000; i++) {
      const y = Math.random() * H;
      if (Math.random() < interference(y, cy, sep, wl, sw)) return y;
    }
    return H / 2;
  }

  function startParticles() {
    const cvs = document.getElementById('c');
    const W = cvs.offsetWidth || 860;
    cvs.width = W * devicePixelRatio; cvs.height = 400 * devicePixelRatio;
    const ctx = cvs.getContext('2d'); ctx.scale(devicePixelRatio, devicePixelRatio);
    const H = 400;
    ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, W, H);
    const screenX = W * 0.80;
    const barrierX = W * 0.35;
    const cy = H / 2;
    const { wl, sep, sw } = getParams();

    // Draw barrier
    const slitTop1 = cy - sep / 2 - sw / 2, slitBot1 = cy - sep / 2 + sw / 2;
    const slitTop2 = cy + sep / 2 - sw / 2, slitBot2 = cy + sep / 2 + sw / 2;
    ctx.fillStyle = 'rgba(80,72,180,0.9)';
    ctx.fillRect(barrierX, 0, 7, slitTop1);
    ctx.fillRect(barrierX, slitBot1, 7, slitTop2 - slitBot1);
    ctx.fillRect(barrierX, slitBot2, 7, H - slitBot2);

    function addParticle() {
      if (mode !== 'particle') return;
      const { wl: wl2, sep: sep2, sw: sw2 } = getParams();
      const y = sampleY(cy, sep2, wl2, sw2, H);
      setTimeout(() => {
        ctx.beginPath(); ctx.arc(screenX + 3, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(127,119,221,0.7)'; ctx.fill();
        particleCount++;
        if (particleCount < 800) addParticle();
      }, 15);
    }
    addParticle();
  }

  document.getElementById('eqbox').textContent = eqs[mode];
  window.addEventListener('resize', draw);
  draw();
})();
