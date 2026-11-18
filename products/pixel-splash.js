/* Load the silent inline demo only when the Product Details portrait is in view. */
(function () {
  'use strict';
  var video = document.getElementById('pixel-demo-video');
  var toggle = document.getElementById('pixel-demo-toggle');
  var gallery = document.getElementById('media-viewer');
  if (!video || !toggle || video.dataset.portraitManaged === '1') return;
  video.dataset.portraitManaged = '1';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var inView = false;
  var userChoice = null;

  function updateToggle() {
    toggle.textContent = video.error ? 'Retry demo' : video.paused ? 'Play demo' : 'Pause demo';
  }

  function play() {
    if (!video.paused) return;
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    video.play().catch(updateToggle);
  }

  function syncPlayback() {
    var wantsPlayback = userChoice === null ? !reduceMotion.matches : userChoice;
    if (wantsPlayback && inView && !document.hidden && (!gallery || gallery.hidden) && !video.error) {
      play();
    } else if (!video.paused) {
      video.pause();
    }
  }

  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  video.addEventListener('playing', function () { video.classList.add('has-frame'); });
  video.addEventListener('error', function () {
    video.classList.remove('has-frame');
    updateToggle();
  });
  toggle.addEventListener('click', function () {
    userChoice = video.paused;
    if (userChoice) {
      if (video.error) video.load();
      play();
    } else {
      video.pause();
    }
  });
  toggle.hidden = false;

  document.addEventListener('visibilitychange', syncPlayback);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', syncPlayback);
  if (gallery && 'MutationObserver' in window) {
    new MutationObserver(syncPlayback).observe(gallery, { attributes: true, attributeFilter: ['hidden'] });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[entries.length - 1].intersectionRatio >= 0.15;
      syncPlayback();
    }, { threshold: 0.15 }).observe(video);
  } else {
    inView = true;
    syncPlayback();
  }
})();
