(function () {
  function buildTrackedUrl(path, content) {
    const base = new URL(path || window.location.pathname, window.location.origin);
    base.searchParams.set("utm_source", "careerkit-share");
    base.searchParams.set("utm_medium", "organic");
    base.searchParams.set("utm_campaign", "careerkit-launch-2026q1");
    base.searchParams.set("utm_content", content || "careerkit");
    return base.toString();
  }

  function setLink(card, platform, href) {
    const link = card.querySelector('[data-platform="' + platform + '"]');
    if (!link) {
      return;
    }
    link.setAttribute("href", href);
  }

  function setCopyStatus(card, message) {
    const status = card.querySelector('[data-role="copy-status"]');
    if (status) {
      status.textContent = message;
    }
  }

  function wireCard(card) {
    const sharePath = card.getAttribute("data-share-path") || window.location.pathname;
    const shareContent = card.getAttribute("data-share-content") || "careerkit";
    const shareTitle = card.getAttribute("data-share-title") || document.title;
    const trackedUrl = buildTrackedUrl(sharePath, shareContent);
    const encodedUrl = encodeURIComponent(trackedUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    setLink(card, "x", "https://x.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl);
    setLink(card, "linkedin", "https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl);
    setLink(card, "reddit", "https://www.reddit.com/submit?url=" + encodedUrl + "&title=" + encodedTitle);
    setLink(card, "email", "mailto:?subject=" + encodedTitle + "&body=" + encodedUrl);

    const trackedUrlLink = card.querySelector('[data-role="tracked-url"]');
    if (trackedUrlLink) {
      trackedUrlLink.textContent = trackedUrl;
      trackedUrlLink.setAttribute("href", trackedUrl);
    }

    const copyButton = card.querySelector('[data-role="copy-link"]');
    if (copyButton) {
      copyButton.addEventListener("click", function () {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
          setCopyStatus(card, "Copy not available in this browser.");
          return;
        }
        navigator.clipboard
          .writeText(trackedUrl)
          .then(function () {
            setCopyStatus(card, "Tracked link copied.");
          })
          .catch(function () {
            setCopyStatus(card, "Copy failed. Use the tracked link below.");
          });
      });
    }
  }

  function initCareerkitShareCards() {
    const cards = document.querySelectorAll(".share-card");
    cards.forEach(function (card) {
      wireCard(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCareerkitShareCards);
  } else {
    initCareerkitShareCards();
  }
})();
