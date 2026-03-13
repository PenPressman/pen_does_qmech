<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Double-Slit Experiment — QM Visualizer</title>
  <link rel="stylesheet" href="../css/main.css">
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      <a href="../index.html" class="logo">QM<span>Viz</span></a>
      <nav>
        <a href="../index.html#applets">All Applets</a>
        <a href="wave-packet.html">Next →</a>
      </nav>
    </div>
  </header>

  <div class="applet-page">
    <div class="applet-header">
      <a href="../index.html#applets" class="back-link">← All Applets</a>
      <div class="chapter-tag">Griffiths Ch. 1</div>
      <h1>Double-Slit Experiment</h1>
      <p class="desc">The central mystery of quantum mechanics. A particle — sent one at a time — produces an interference pattern, unless you measure which slit it went through.</p>
    </div>

    <div class="applet-main">
      <div class="widget-wrap">
        <div class="widget-inner">
          <div class="tab-bar">
            <button class="tab-btn active" onclick="setMode('wave',this)">Wave mode</button>
            <button class="tab-btn" onclick="setMode('particle',this)">Particle mode</button>
            <button class="tab-btn" onclick="setMode('which-way',this)">Which-way detector</button>
          </div>
          <canvas id="c" height="400"></canvas>
          <div style="margin-top:1rem">
            <div class="ctrl-row"><label>Wavelength λ</label><input type="range" id="wl" min="20" max="80" value="40" oninput="draw()"><span class="val" id="wl-v">40</span></div>
            <div class="ctrl-row"><label>Slit separation d</label><input type="range" id="sep" min="30" max="120" value="70" oninput="draw()"><span class="val" id="sep-v">70</span></div>
            <div class="ctrl-row"><label>Slit width a</label><input type="range" id="sw" min="4" max="28" value="12" oninput="draw()"><span class="val" id="sw-v">12</span></div>
          </div>
          <div class="eq-box" id="eqbox"></div>
        </div>
      </div>

      <div class="explainer">
        <h3>What you're seeing</h3>
        <p><strong>Wave mode:</strong> The particle travels as a probability wave through <em>both</em> slits simultaneously. Waves from each slit superpose — bright fringes where they add constructively, dark nodes where they cancel.</p>
        <p><strong>Particle mode:</strong> Each particle lands at random, but over thousands of particles the interference pattern emerges — even though each particle is sent alone.</p>
        <p><strong>Which-way detector:</strong> Measuring which slit the particle passes through collapses the wavefunction. The interference pattern disappears — replaced by two independent bands. This is complementarity: wave and particle properties cannot both be observed simultaneously.</p>
        <ul>
          <li>Fringe spacing: Δy ≈ λL/d</li>
          <li>Single-slit envelope zeros at sin θ = mλ/a</li>
          <li>Intensity: I ∝ sinc²(πa sinθ/λ) · cos²(πd sinθ/λ)</li>
        </ul>
      </div>
    </div>
  </div>

  <script src="../js/applets/double-slit.js"></script>
</body>
</html>
