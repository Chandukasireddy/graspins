// ------------------------------------------------------------
// Mobile navigation toggle (replicates the original menu behavior)
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var menuBtn = document.getElementById("menu-toggle");
  var sidebar = document.getElementById("mobile-menu");
  var menuIcon = document.getElementById("menu-icon");

  if (menuBtn && sidebar && menuIcon) {
    var open = false;
    menuBtn.addEventListener("click", function () {
      open = !open;
      if (open) {
        sidebar.classList.remove("hidden");
        sidebar.classList.add("flex");
        menuIcon.src = "assets/close.svg";
      } else {
        sidebar.classList.add("hidden");
        sidebar.classList.remove("flex");
        menuIcon.src = "assets/menu.svg";
      }
    });

    sidebar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        open = false;
        sidebar.classList.add("hidden");
        sidebar.classList.remove("flex");
        menuIcon.src = "assets/menu.svg";
      });
    });
  }
});

// ------------------------------------------------------------
// Graceful image loading: fade images in once loaded; hide any
// image that fails so the broken-image icon / alt text never shows.
// ------------------------------------------------------------
(function () {
  function reveal(img) {
    img.classList.add("is-loaded");
  }
  function hide(img) {
    img.style.visibility = "hidden";
  }

  function wire(img) {
    // Already loaded (e.g. cached) before this script ran
    if (img.complete) {
      if (img.naturalWidth > 0) reveal(img);
      else hide(img);
      return;
    }
    img.addEventListener("load", function () {
      reveal(img);
    });
    img.addEventListener("error", function () {
      hide(img);
    });
  }

  document.querySelectorAll("img").forEach(wire);
})();
