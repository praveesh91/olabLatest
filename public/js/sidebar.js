//bind event handler with toggle click
(() => {
  const toggleId = "header-toggle",
    navId = "nav-bar",
    bodyId = "basic-layout",
    headerId = "header";
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

  // Validate that all variables exist
  if (toggle && nav && bodypd && headerpd) {
    toggle.addEventListener("click", () => {
      // show navbar
      nav.classList.toggle("show");
      // change icon
      headerpd.classList.toggle("active");
      // add padding to body
      bodypd.classList.toggle("body-pd");
      // add padding to header
      headerpd.classList.toggle("header-pd");
    });
  }

  document
    .querySelectorAll(".main-menu > .item > .line")
    .forEach(function (line) {
      line.addEventListener("click", function (event) {
        line.parentElement.classList.toggle("collapsed");
      });
    });
})();
