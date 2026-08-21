/*
  MOBILE MENU TOGGLE

  This is the only JavaScript on the site. It simply shows/hides the
  navigation links on small screens when the menu button is tapped.
  There is nothing here that needs to change when editing page content.
*/
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});
