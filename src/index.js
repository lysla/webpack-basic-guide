import jquery from "jquery";
window.jQuery = window.$ = jquery;

// Bootstrap Framework
import "./scss/index.scss";
import "@popperjs/core";
import "bootstrap";

import "slick-carousel";
import hcSticky from "hc-sticky";

//#region stickybar
document.addEventListener("DOMContentLoaded", function () {
  new hcSticky(".stickybar", {
    stickTo: "body",
    stickyClass: "stickybar--sticked",
  });
});
//#endregion

//#region gallery
$(function () {
  $(".gallery").slick({
    arrows: true,
    dots: false,
  });
});
//#endregion

//#region sticky dish categories and sidebar
document.addEventListener("DOMContentLoaded", function () {
  new hcSticky(".sidebar-dish-category", {
    stickTo: ".menu",
    top: 100,
  });
  new hcSticky(".menu-order", {
    stickTo: ".menu",
    top: 100,
  });
});
//#endregion

//#region filterbar__wrapper
$(function () {
  $(".filterbar__wrapper").slick({
    arrows: true,
    dots: false,
    variableWidth: true,
    infinite: false,
  });
});
//#endregion
