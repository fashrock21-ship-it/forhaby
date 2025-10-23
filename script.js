// Small animated starfield + typing message + certificate download
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight});

// create stars (reduced for better performance)
const nStars = 160;
const stars = [];
for(let i=0;i<nStars;i++) stars.push({
    x: Math.random()*w,
    y: Math.random()*h,
    z: Math.random()*1.2+0.2,
    size: Math.random()*1.2+0.1,
    alpha: Math.random()*0.8+0.2
});

let glow = 0.9;
function draw(){
  ctx.clearRect(0,0,w,h);
  // subtle gradient
  const grad = ctx.createRadialGradient(w/2,h/2,10,w/2,h/2,Math.max(w,h)/1.2);
  grad.addColorStop(0,'rgba(20,30,40,'+ (0.06*glow) +')');
  grad.addColorStop(1,'rgba(0,0,0,0.6)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,w,h);

  for(const s of stars){
    // Normal-paced, smooth star movement
    s.x += (s.z*0.32); // normal paced star drift
    s.y += Math.sin((s.x+s.z)*0.0014)*0.18;
    if(s.x > w+20){s.x=-20;s.y=Math.random()*h}

    // Gentle pulse
    const pulseIntensity = 0.9 + Math.sin(Date.now() * 0.0014 + s.x) * 0.12;
    // Add subtle star glow
    const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size*s.z*1.6);
    gradient.addColorStop(0, `rgba(255,255,255,${Math.min(0.85, 0.6*s.alpha*glow*pulseIntensity)})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size*s.z*1.2, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// --- Visual effects: shooting stars, confetti, cursor sparkles ---
const shootingStars = [];
function spawnShootingStar(){
  const centerX = w/2;
  const centerY = h/2 - 100; // Slightly above center
  shootingStars.push({
    x: centerX + (Math.random()-0.5)*w*0.5,
    y: centerY - h*0.18 + Math.random()*h*0.12,
    len: Math.random()*140+80, // normal streaks
    spd: Math.random()*5+4,    // normal speed
    angle: Math.random()*0.5+0.18,
    alpha: 1
  });
}

function drawShootingStars(){
  for(let i=shootingStars.length-1;i>=0;i--){
    const s = shootingStars[i];
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.lineWidth = 2;
    ctx.moveTo(s.x,s.y);
    ctx.lineTo(s.x - s.len * s.angle, s.y + s.len * (1-s.angle));
    ctx.stroke();
    ctx.restore();
    s.x += s.spd;
    s.y += s.spd*0.3;
    s.alpha -= 0.01;
    if(s.alpha <= 0) shootingStars.splice(i,1);
  }
}

// spawn occasional shooting star (slightly more frequent)
setInterval(()=>{ if(Math.random()<0.85) spawnShootingStar(); }, 1000);

// Confetti removed for a calmer experience.
// Instead we'll draw a slow, warm glow overlay that pulses gently.
let warmGlow = 0.18; // base intensity
let warmBoost = 0; // temporary boost on reveal
function pulseWarmBoost(amount){ warmBoost = Math.max(warmBoost, amount); }

// Cursor sparkle
const sparkles = [];
window.addEventListener('pointermove',(e)=>{
  sparkles.push({x:e.clientX,y:e.clientY,life:22,alpha:1,size:Math.random()*5+3});
  if(sparkles.length>28) sparkles.shift();
});

function drawSparkles(){
  for(let i=sparkles.length-1;i>=0;i--){
    const s = sparkles[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fill();
    s.alpha -= 0.06; s.size *= 0.98; s.life--; if(s.life<=0) sparkles.splice(i,1);
  }
}


// typing effect
const baseMessage = (name)=>{
  return `Dear ${name},\n\nI made this little sky tonight because I wanted a quiet place to tell you something true: you are cherished more than words can hold.\n\nYou bring warmth to ordinary days, courage to uncertain ones, and a kindness that makes every small moment feel like home. I am grateful for your laughter, your trust, and the way you make me want to be better.\n\nTonight, each star is a thank-you — for your patience, your light, and for being exactly who you are. I hope this feels like a small reminder of how deeply you are appreciated.\n\nWith all my love,\nLabby`;
};
const typingEl = document.getElementById('typing');
const revealBtn = document.getElementById('revealBtn');
const nameInput = document.getElementById('nameInput');
const final = document.getElementById('final');
const greeting = document.getElementById('greeting');
const poemEl = document.getElementById('poem');
const downloadBtn = document.getElementById('downloadCert');
const playPauseBtn = document.getElementById('playPause');
const bgm = document.getElementById('bgm');
const audioHint = document.getElementById('audioHint');

function typeMessage(text, onComplete){
  typingEl.textContent = '';
  let i=0;
  const t = setInterval(()=>{
    typingEl.textContent = text.slice(0,i+1).replace(/\n/g,'\n');
    i++;
    if(i>=text.length){clearInterval(t);if(onComplete) onComplete();}
  },14);
}

// Set name to Haby on page load
window.addEventListener('load', () => {
  if(nameInput) nameInput.value = 'Haby';
});

revealBtn.addEventListener('click', ()=>{
  // Hide the reveal button
  revealBtn.style.opacity = '0';
  revealBtn.style.transform = 'scale(0.9)';
  setTimeout(() => revealBtn.style.display = 'none', 300);

  const name = 'Haby'; // Always use Haby
  const msg = baseMessage(name);
  
  // Add pre-typing effects
  for(let i=0; i<3; i++) {
    setTimeout(() => spawnShootingStar(), i * 300);
  }
  
  setTimeout(() => {
    typeMessage(msg, ()=>{
      greeting.textContent = `Dear ${name},`;
      poemEl.textContent = "I found a sky of wishes where every star is you.\nYour laugh—my favorite orbit.\nYour eyes—my map to home.\nStay with me across every galaxy.";
      final.hidden = false;
      
      // Reveal the download button with animation
      downloadBtn.hidden = false;
      downloadBtn.style.opacity = '0';
      downloadBtn.style.transform = 'translateY(10px)';
      setTimeout(() => {
        downloadBtn.style.transition = 'all 0.5s ease';
        downloadBtn.style.opacity = '1';
        downloadBtn.style.transform = 'translateY(0)';
      }, 100);
      
      // animate greeting and poem gently
      greeting.classList.add('reveal-zoom');
      poemEl.classList.add('particle-burst');
      
      // gentle shooting burst
      for(let i=0; i<4; i++) {
        setTimeout(() => spawnShootingStar(), i * 200);
      }
      
      // pulse a warm glow overlay
      pulseWarmBoost(0.35);
      
      // Try to autoplay on user gesture: start music if available
      if(bgm && bgm.src && bgm.src.indexOf('bgm.mp3')!==-1){
        bgm.play().then(()=>{playPauseBtn.textContent='Pause music'}).catch(()=>{/* autoplay blocked or missing */});
      }
    });
  }, 1000);
});

// certificate download
function generateCertificate(name){
  const date = new Date().toLocaleDateString();
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'>\n  <defs>\n    <linearGradient id='g' x1='0' x2='1'>\n      <stop offset='0' stop-color='#001b2e'/>\n      <stop offset='1' stop-color='#052a4d'/>\n    </linearGradient>\n    <style>\n      .title{fill:#fff;font-family:Georgia,serif;font-size:48px;font-weight:700}\n      .label{fill:#cfeeff;font-family:Arial,Helvetica,sans-serif;font-size:22px}\n      .big{fill:#fff;font-family:Arial,Helvetica,sans-serif;font-size:36px;font-weight:700}\n    </style>\n  </defs>\n  <rect width='100%' height='100%' fill='url(#g)' rx='20'/>\n  <g transform='translate(80,80)'>\n    <text class='title' x='0' y='60'>Certificate of Stargazing</text>\n    <text class='label' x='0' y='140'>Awarded to</text>\n    <text class='big' x='0' y='200'>${escapeXml(name)}</text>\n    <text class='label' x='0' y='260'>For being the person who makes the night brighter</text>\n    <text class='label' x='0' y='340'>Date: ${escapeXml(date)}</text>\n    <g transform='translate(700,60)'>\n      <circle cx='120' cy='120' r='110' fill='rgba(255,255,255,0.06)'/>\n      <text x='120' y='130' text-anchor='middle' fill='#fff' font-size='20'>⭐</text>\n    </g>\n  </g>\n</svg>`;
  return svg;
}

function escapeXml(unsafe){return unsafe.replace(/[<>&"']/g,(c)=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'})[c]);}

downloadBtn.addEventListener('click', ()=>{
  const name = 'Haby'; // Always use Haby for the certificate
  const svg = generateCertificate(name);
  const blob = new Blob([svg],{type:'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `certificate_${name.replace(/\s+/g,'_') || 'my_love'}.svg`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

// Play/pause button behavior with fade effects
if(playPauseBtn){
  // Set initial volume to 0 for fade-in
  bgm.volume = 0;
  
  // Detect if music file exists and is loaded
  let bgmAvailable = false;
  bgm.addEventListener('loadedmetadata', ()=>{ 
    bgmAvailable = true; 
    audioHint.style.display='none';
    playPauseBtn.disabled = false;
  });
  
  // Fade functions (gentle)
  const fadeStep = 0.01;
  const fadeIn = () => {
    if(bgm.volume < 0.55) {
      bgm.volume = Math.min(0.55, bgm.volume + fadeStep);
      setTimeout(fadeIn, 110);
    }
  };
  
  const fadeOut = (onComplete) => {
    if(bgm.volume > 0.01) {
      bgm.volume = Math.max(0, bgm.volume - fadeStep);
      setTimeout(() => fadeOut(onComplete), 90);
    } else {
      bgm.pause();
      bgm.volume = 0;
      if(onComplete) onComplete();
    }
  };

  playPauseBtn.addEventListener('click', ()=>{
    if(bgm.paused){
      bgm.volume = 0;
      bgm.play();
      fadeIn();
      playPauseBtn.textContent = 'Pause music';
    } else {
      fadeOut(() => {
        playPauseBtn.textContent = 'Play music';
      });
    }
  });
}

// Surprise (cinematic) handlers: hearts, modal, audio boost, and big bang ---
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const closeSurprise = document.getElementById('closeSurprise');

// Explosion particles for big bang effect
const explosionParticles = [];
function createExplosion(x, y) {
  const colors = ['#ff6b85', '#ffb38a', '#ffd700', '#ff4d6d', '#ffffff'];
  
  // Create explosion particles at a normal pace
  for(let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 6; // normal explosion burst
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 220; // shorter random delay
    
    setTimeout(() => {
      explosionParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: Math.random() * 60 + 40, // faster fade
        size: Math.random() * 3 + 1.5,
        opacity: 1,
        rotation: Math.random() * 360
      });
    }, delay);
  }
  
  // Shockwave effect (quicker)
  explosionParticles.push({
    x, y,
    isShockwave: true,
    size: 1,
    maxSize: Math.min(w, h) / 3.8,
    life: 26,
    opacity: 0.95
  });
}

function drawExplosion() {
  for(let i = explosionParticles.length - 1; i >= 0; i--) {
    const p = explosionParticles[i];
    if(p.isShockwave) {
      // Smoother shockwave
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, (p.life/30) * p.opacity)})`;
      ctx.lineWidth = 1.5;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
      // Smoother expansion
      p.size += (p.maxSize - p.size) * 0.22; // expand a bit quicker
      p.opacity *= 0.96;
    } else {
      // Particle glow effect
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      const alpha = (p.life/180);
      gradient.addColorStop(0, `${p.color}${Math.floor(alpha*255).toString(16).padStart(2,'0')}`);
      gradient.addColorStop(1, `${p.color}00`);
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI/180);
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
  // Balanced movement for normal burst
  p.x += p.vx * 1.0;
  p.y += p.vy * 1.0;
  p.vx *= 0.993;
  p.vy *= 0.993;
  p.vy += 0.12;
  p.rotation += 1.5;
    }
    p.life--;
    if(p.life <= 0) explosionParticles.splice(i, 1);
  }
}

// Heart particle burst for Surprise
const hearts = [];
function spawnHeart(x,y){
  const baseScale = 0.9 + Math.random()*0.4;
  hearts.push({
    x,
    y,
    vx: (Math.random()-0.5)*3.0, // livelier horizontal movement
    vy: Math.random()*-5-2.0,    // slightly stronger upward movement
    rot: Math.random()*360,
    vr: (Math.random()-0.5)*3,   // Slower rotation
    life: Math.random()*90+100,  // Longer life for smoother fade
    scale: baseScale,
    targetScale: baseScale * (1 + Math.random()*0.2), // For pulsing effect
    opacity: 0,                   // Start transparent
    hue: Math.random()*20         // Slight color variation
  });
}

function drawHearts(){
  for(let i=hearts.length-1;i>=0;i--){
    const p = hearts[i];
    
    // Smooth opacity fade in/out
    if(p.life > 160) {
        p.opacity = Math.min(1, p.opacity + 0.03);
    } else if(p.life < 50) {
      p.opacity *= 0.95;
    }
    
    // Smooth scale pulsing
    p.scale += (p.targetScale - p.scale) * 0.05;
    if(Math.abs(p.targetScale - p.scale) < 0.01) {
      p.targetScale = p.targetScale === p.scale ? 
        p.scale * (1 + Math.random()*0.2) : 
        p.scale / (1 + Math.random()*0.2);
    }
    
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot*Math.PI/180);
    ctx.scale(p.scale, p.scale);
    
    // Heart shape with glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
    const baseColor = `hsla(${345+p.hue}, 100%, 70%, ${p.opacity})`;
    const glowColor = `hsla(${345+p.hue}, 100%, 80%, ${p.opacity * 0.5})`;
    
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, 'rgba(255,110,130,0)');
    
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.bezierCurveTo(6,-18,24,-6,0,18);
    ctx.bezierCurveTo(-24,-6,-6,-18,0,-6);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.restore();
    
    // Smoother movement
    p.x += p.vx * 0.98;
    p.y += p.vy;
    p.vy += 0.12;    // Gentler gravity
    p.rot += p.vr;
    p.life--;
    
    if(p.life<=0 || p.y>h+60) hearts.splice(i,1);
  }
}

// Surprise handler with touch support and explosion
function triggerSurprise(event) {
    event.preventDefault();
    
    // Fade out and remove the initial view
    const initialView = document.querySelector('.initial-view');
    if(initialView) {
        initialView.style.opacity = '0';
        initialView.style.transform = 'translateY(-20px)';
        initialView.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            initialView.remove();
        }, 500);
    }
    
    // Show the message box with reveal button
    const messageBox = document.getElementById('message-box');
    if(messageBox) {
        messageBox.hidden = false;
        messageBox.style.opacity = '0';
        messageBox.style.transform = 'translateY(20px)';
        messageBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            messageBox.style.opacity = '1';
            messageBox.style.transform = 'translateY(0)';
        }, 100);
    }
    
    nameInput.value = 'Haby';
    
    // Create initial sparkle effect
    for(let i = 0; i < 8; i++) {
        setTimeout(() => spawnShootingStar(), i * 200);
    }

    // Get the button's position for the explosion center
    const buttonRect = surpriseBtn.getBoundingClientRect();
    const explosionX = buttonRect.left + buttonRect.width / 2;
    const explosionY = buttonRect.top + buttonRect.height / 2;
    createExplosion(explosionX, explosionY);
    
    // Cinematic effect sequence
    setTimeout(() => {
        // Create a centered area for effects
        const centerX = w/2;
        const centerY = h/2 - 100; // Slightly above center
        
        // bigger shooting burst
        for(let i=0; i<12; i++) {
            setTimeout(() => spawnShootingStar(), i * 100);
        }
        // hearts burst in waves (optimized)
        for(let i=0; i<24; i++) {
            setTimeout(() => {
                spawnHeart(centerX + (Math.random()-0.5)*160, centerY + (Math.random()-0.5)*35);
            }, i * 80);
        }
    }, 300);

    // Audio effects
    if(!bgm.paused) {
        bgm.volume = Math.min(0.8, (bgm.volume||0)+0.25);
        setTimeout(() => bgm.volume = Math.min(0.85, bgm.volume + 0.1), 800);
    }
    pulseWarmBoost(0.65);
    playChime();

    // Show modal with animation
    if(surpriseModal) {
        surpriseModal.hidden = false;
        document.querySelector('.modal-content').style.animation = 'modalIn 0.6s cubic-bezier(.17,1.5,.21,1)';
    }

    // Graceful fadeout sequence
    setTimeout(() => {
        if(!bgm.paused) {
            fadeOut(() => bgm.volume = 0.55);
        }
        warmBoost = Math.min(warmBoost, 0.15);
        setTimeout(() => {
            if(surpriseModal) surpriseModal.hidden = true;
        }, 1500);
    }, 8000);
}

// Add touch and click event listeners for surprise button
if(surpriseBtn) {
    surpriseBtn.addEventListener('click', triggerSurprise);
    surpriseBtn.addEventListener('touchstart', triggerSurprise);
}

// Enhanced close button functionality
if(closeSurprise){
  // Handle both click and touch events
  const closeModal = (e) => {
    e.preventDefault();
    if(surpriseModal) {
      // Fade out animation
      surpriseModal.style.opacity = '0';
      surpriseModal.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        surpriseModal.hidden = true;
        surpriseModal.style.opacity = '1';
      }, 300);
    }
  };
  
  closeSurprise.addEventListener('click', closeModal);
  closeSurprise.addEventListener('touchend', closeModal);
  
  // Also allow clicking outside modal to close
  surpriseModal?.addEventListener('click', (e) => {
    if(e.target === surpriseModal) {
      closeModal(e);
    }
  });
}

// toggle glow with spacebar
window.addEventListener('keydown',(e)=>{if(e.code==='Space'){glow = glow>0.3?0.2:0.95; e.preventDefault();}});

// small accessibility: reveal with Enter in input
nameInput.addEventListener('keydown',(e)=>{if(e.key==='Enter') revealBtn.click();});

// --- Audio visualizer setup ---
const visualizerContainer = document.createElement('div');
visualizerContainer.className = 'visualizer';
document.body.appendChild(visualizerContainer);
const nBars = 24;
const bars = [];
for(let i=0;i<nBars;i++){ const b=document.createElement('div'); b.className='bar'; visualizerContainer.appendChild(b); bars.push(b); }

let audioCtx, analyser, dataArray, sourceNode;
function setupAudioVisualizer(){
  if(!window.AudioContext && !window.webkitAudioContext) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128; // fewer bins for smoother response
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  try{
    sourceNode = audioCtx.createMediaElementSource(bgm);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  }catch(e){console.warn('WebAudio setup failed',e);}
}

// Play a short synthesized chime (cinematic) using WebAudio
function playChime(){
  try{
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = 0.12; master.connect(ctx.destination);
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator(); const osc2 = ctx.createOscillator();
    const g1 = ctx.createGain(); const g2 = ctx.createGain();
    osc1.type = 'sine'; osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(520, now); osc2.frequency.setValueAtTime(780, now);
    g1.gain.setValueAtTime(0, now); g2.gain.setValueAtTime(0, now);
    osc1.connect(g1); osc2.connect(g2); g1.connect(master); g2.connect(master);
    osc1.start(now); osc2.start(now);
    g1.gain.linearRampToValueAtTime(0.14, now+0.02); g2.gain.linearRampToValueAtTime(0.08, now+0.02);
    g1.gain.exponentialRampToValueAtTime(0.001, now+1.2); g2.gain.exponentialRampToValueAtTime(0.001, now+1.2);
    osc1.stop(now+1.3); osc2.stop(now+1.3);
    // if we created a private ctx, close it after
    if(!audioCtx) setTimeout(()=>ctx.close(),1500);
  }catch(e){/* ignore */}
}

function updateVisualizer(){
  if(!analyser) return;
  analyser.getByteFrequencyData(dataArray);
  const step = Math.floor(dataArray.length / nBars);
  for(let i=0;i<nBars;i++){
    const val = dataArray[i*step];
  const target = Math.max(6, (val/255) * 48); // lower sensitivity and max height
    const current = parseFloat(bars[i].style.height) || 6;
    const next = current + (target - current) * 0.12; // lerp factor
    bars[i].style.height = next + 'px';
  }
}

// Start audio context on first user gesture
window.addEventListener('click', function once(){
  try{ if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }catch(e){}
  if(!audioCtx) setupAudioVisualizer();
  window.removeEventListener('click', once);
});

// integrate visual draws into animation loop
const originalDraw = draw;
function drawAll(){
  originalDraw();
  drawShootingStars();
  drawSparkles();
  drawHearts();
  drawExplosion(); // Add explosion effect
  updateVisualizer();
  // draw warm glow overlay (subtle)
  if(warmBoost>0){ warmBoost *= 0.96; }
  const glowIntensity = Math.min(0.5, warmGlow + warmBoost);
  ctx.fillStyle = `radial-gradient(ellipse at 50% 40%, rgba(255,200,140,${glowIntensity}) 0%, rgba(255,200,140,0) 45%)`;
  // draw a soft radial manually since canvas doesn't accept CSS gradients via fillStyle directly
  const centerY = h/2 - 100; // Match the new center point
  const g = ctx.createRadialGradient(w/2, centerY, 10, w/2, centerY, Math.max(w,h)/1.6);
  g.addColorStop(0, `rgba(255,200,140,${glowIntensity})`);
  g.addColorStop(0.6, 'rgba(255,200,140,0.06)');
  g.addColorStop(1, 'rgba(255,200,140,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);
  requestAnimationFrame(drawAll);
}
// replace main loop
requestAnimationFrame(drawAll);
