// Mobile navigation toggle (replicates Navbar useState toggle)
document.addEventListener("DOMContentLoaded", function () {
  var menuBtn = document.getElementById("menu-toggle");
  var sidebar = document.getElementById("mobile-menu");
  var menuIcon = document.getElementById("menu-icon");

  if (!menuBtn || !sidebar || !menuIcon) return;

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

  // Close menu after clicking a link
  sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      open = false;
      sidebar.classList.add("hidden");
      sidebar.classList.remove("flex");
      menuIcon.src = "assets/menu.svg";
    });
  });
});
