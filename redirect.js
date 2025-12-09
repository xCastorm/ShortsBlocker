(function () {

  // --- 1. Redirect ANY Shorts URL instantly ---
  function redirectIfShorts() {
    const url = new URL(window.location.href);
    if (url.pathname.startsWith("/shorts/")) {
      console.log("Shorts detected — redirecting");
      window.location.href = "https://www.youtube.com/";
    }
  }


  // --- 2. Remove ALL Shorts UI anywhere on YouTube ---
  function removeAllShortsUI() {

    // A) Sidebar Shorts button
    document.querySelectorAll(
      'yt-formatted-string.title.style-scope.ytd-guide-entry-renderer'
    ).forEach(label => {
      if (label.textContent.trim().toLowerCase() === "shorts") {
        const parent =
          label.closest("ytd-guide-entry-renderer") ||
          label.closest("a") ||
          label;
        parent.remove();
      }
    });

    // B) Any link pointing to shorts pages
    document.querySelectorAll('a[href*="/shorts/"]').forEach(a => {
      const parent =
        a.closest("ytd-rich-item-renderer") ||
        a.closest("ytd-video-renderer") ||
        a.closest("ytd-grid-video-renderer") ||
        a.closest("ytd-guide-entry-renderer") ||
        a.closest("ytd-compact-video-renderer") ||
        a.closest("ytd-reel-video-renderer") ||
        a.closest("a") ||
        a;
      parent.remove();
    });

    // C) Shorts shelf on homepage (carousel of shorts)
    document.querySelectorAll("ytd-rich-shelf-renderer").forEach(shelf => {
      const title = shelf.querySelector("span#title");
      if (!title) return;

      if (title.textContent.trim().toLowerCase().includes("shorts")) {
        shelf.remove();
      }
    });

    // D) Shorts shelves under videos
    document.querySelectorAll("ytd-reel-shelf-renderer").forEach(el => el.remove());

    // E) Shorts player elements
    const shortsPlayerSelectors = [
      "ytd-reel-player-header-renderer",
      "ytd-reel-video-renderer",
      "#shorts-player",
      "ytd-shorts",
      "ytd-reel-player-renderer"
    ];
    shortsPlayerSelectors.forEach(sel =>
      document.querySelectorAll(sel).forEach(el => el.remove())
    );

    // F) Shorts in search results
    document.querySelectorAll("ytd-reel-shelf-renderer").forEach(el => el.remove());

    // G) Shorts tray on mobile layout
    document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(el => {
      if (el.textContent.trim().toLowerCase() === "shorts") el.remove();
    });

    // H) Shorts preview thumbnails
    document.querySelectorAll("ytd-thumbnail a[href*='/shorts/']").forEach(a => {
      const parent = a.closest("ytd-rich-item-renderer") || a.closest("ytd-video-renderer");
      if (parent) parent.remove();
    });
  }


  // --- Initial run ---
  redirectIfShorts();
  removeAllShortsUI();

  // --- MutationObserver: catches YouTube dynamic loading ---
  const observer = new MutationObserver(() => {
    redirectIfShorts();
    removeAllShortsUI();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // --- Backup interval every 5 seconds (for deep lazy-loaded content) ---
  setInterval(() => {
    redirectIfShorts();
    removeAllShortsUI();
  }, 5000);

})();
