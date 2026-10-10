/* Gloria Darnell — portfolio interactions.
   Everything here is progressive enhancement: every credential card is a real
   link to its own certificate page, so the site works fully without JS. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal ------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Active section in the nav ------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[e.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* ---------- Stat count-up ------------------------------------------- */
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var start = performance.now(), dur = 1300;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Certificate lightbox ------------------------------------ */
  var lb = document.getElementById("lightbox");
  if (!lb) return;

  var lbImg   = lb.querySelector("[data-lb-img]");
  var lbTitle = lb.querySelector("[data-lb-title]");
  var lbMeta  = lb.querySelector("[data-lb-meta]");
  var lbPage  = lb.querySelector("[data-lb-page]");
  var lbPdf   = lb.querySelector("[data-lb-pdf]");
  var lbClose = lb.querySelector(".lb-close");
  var lastFocus = null;

  function openLightbox(card) {
    lastFocus = card;
    lbImg.src = card.getAttribute("data-full");
    lbImg.alt = card.getAttribute("data-title") + " certificate for Gloria Darnell";
    lbTitle.textContent = card.getAttribute("data-title");
    lbMeta.textContent = card.getAttribute("data-meta");
    lbPage.href = card.getAttribute("href");
    lbPdf.href = card.getAttribute("data-pdf");
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (card) {
    card.addEventListener("click", function (ev) {
      // Let modified clicks (new tab, etc.) behave like normal links
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
      ev.preventDefault();
      openLightbox(card);
    });
  });

  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (ev) { if (ev.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (ev) {
    if (!lb.classList.contains("is-open")) return;
    if (ev.key === "Escape") { closeLightbox(); return; }
    // Keep Tab focus inside the dialog
    if (ev.key === "Tab") {
      var f = lb.querySelectorAll("a[href], button");
      var first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
})();
