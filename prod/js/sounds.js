// ── SOUNDS ────────────────────────────────────────────────────────────────────
// Procedural Web Audio API sound engine — no external files needed.

var Sounds = (function () {
  'use strict';

  var _ctx = null;

  function ctx() {
    if (!_ctx) {
      try {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  // Resume on any user interaction (browser autoplay policy)
  document.addEventListener('pointerdown', function () {
    if (_ctx && _ctx.state === 'suspended') _ctx.resume();
  }, { passive: true });

  // ── helpers ─────────────────────────────────────────────────────────────────

  function noiseBuffer(ac, dur) {
    var len = Math.floor(ac.sampleRate * dur);
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ── individual sounds ───────────────────────────────────────────────────────

  function pickup() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(480, t);
    o.frequency.exponentialRampToValueAtTime(740, t + 0.07);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.28, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.13);
  }

  function drop() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, t);
    o.frequency.exponentialRampToValueAtTime(170, t + 0.07);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.12);
  }

  function wallClear() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    // Soft bubble pop — quick pitch drop, muffled and round
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.1);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.28, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.15);
    // Tiny air puff at the pop moment
    var src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.06);
    var lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    var gn = ac.createGain();
    gn.gain.setValueAtTime(0.08, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    src.connect(lp); lp.connect(gn); gn.connect(ac.destination);
    src.start(t);
  }

  function uiClick() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(500, t);
    o.frequency.exponentialRampToValueAtTime(360, t + 0.05);
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.08);
  }

  function timerTick() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'square';
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.06);
  }

  function timeout() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(440, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.65);
    g.gain.setValueAtTime(0.22, t);
    g.gain.setValueAtTime(0.22, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.72);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.75);
  }

  function dynamiteBeep() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'square';
    o.frequency.value = 960;
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.1);
  }

  function dynamiteExplode() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    // Deep kick thump
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(25, t + 0.35);
    g.gain.setValueAtTime(0.75, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.42);
    // Noise body
    var src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.5);
    var lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2200, t);
    lp.frequency.exponentialRampToValueAtTime(220, t + 0.42);
    var gn = ac.createGain();
    gn.gain.setValueAtTime(0.55, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.46);
    src.connect(lp); lp.connect(gn); gn.connect(ac.destination);
    src.start(t);
  }

  function freeze() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    // Ice crystal chimes
    [2093, 2794, 3136, 4186, 2637, 3520].forEach(function (freq, i) {
      var o = ac.createOscillator();
      var g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      var s = t + i * 0.048;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.14, s + 0.018);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.38);
      o.connect(g); g.connect(ac.destination);
      o.start(s); o.stop(s + 0.42);
    });
    // Cold high-frequency air rush
    var src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.4);
    var hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3500;
    var gn = ac.createGain();
    gn.gain.setValueAtTime(0, t);
    gn.gain.linearRampToValueAtTime(0.18, t + 0.05);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    src.connect(hp); hp.connect(gn); gn.connect(ac.destination);
    src.start(t);
  }

  function thaw() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    // Warm rising tone
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(660, t + 0.28);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.35);
    // Dripping bubble pops
    for (var i = 0; i < 4; i++) {
      (function (j) {
        var oo = ac.createOscillator();
        var gg = ac.createGain();
        oo.type = 'sine';
        var s = t + j * 0.07;
        var f = 700 + Math.random() * 500;
        oo.frequency.setValueAtTime(f, s);
        oo.frequency.exponentialRampToValueAtTime(f * 0.55, s + 0.07);
        gg.gain.setValueAtTime(0.12, s);
        gg.gain.exponentialRampToValueAtTime(0.001, s + 0.1);
        oo.connect(gg); gg.connect(ac.destination);
        oo.start(s); oo.stop(s + 0.12);
      })(i);
    }
  }

  function blackhole() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    // Low gravitational whoosh sweeping down
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 0.62);
    g.gain.setValueAtTime(0.28, t);
    g.gain.setValueAtTime(0.28, t + 0.48);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.67);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.7);
    // Sucking noise sweep
    var src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.65);
    var bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1000, t);
    bp.frequency.exponentialRampToValueAtTime(60, t + 0.6);
    bp.Q.value = 3;
    var gn = ac.createGain();
    gn.gain.setValueAtTime(0.3, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.63);
    src.connect(bp); bp.connect(gn); gn.connect(ac.destination);
    src.start(t);
  }

  function boosterClick() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = 680;
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.07);
  }

  function boosterEmpty() {
    var ac = ctx(); if (!ac) return;
    var t = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(230, t);
    o.frequency.exponentialRampToValueAtTime(130, t + 0.13);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.16);
  }

  // ── public API ───────────────────────────────────────────────────────────────

  return {
    pickup:          pickup,
    drop:            drop,
    wallClear:       wallClear,
    uiClick:         uiClick,
    timerTick:       timerTick,
    timeout:         timeout,
    dynamiteBeep:    dynamiteBeep,
    dynamiteExplode: dynamiteExplode,
    freeze:          freeze,
    thaw:            thaw,
    blackhole:       blackhole,
    boosterClick:    boosterClick,
    boosterEmpty:    boosterEmpty,
  };
})();
