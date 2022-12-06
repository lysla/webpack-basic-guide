import jquery from "jquery";
window.jQuery = window.$ = jquery;

// Bootstrap Framework
import "./scss/index.scss";
import "@popperjs/core";
import "bootstrap";

import "slick-carousel";
import hcSticky from "hc-sticky";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Moncal } from "./moncaljs/index";

//#region bootstrap navbar + hamburger + body scroll lock
var navbarMain = document.getElementById("navbarMain");
navbarMain.addEventListener("show.bs.collapse", function () {
  $(".navbar-toggler .hamburger").addClass("is-active");
  let scrollableNav = document.querySelector("#navbarMain");
  disableBodyScroll(scrollableNav);
});
navbarMain.addEventListener("hidden.bs.collapse", function () {
  $(".navbar-toggler .hamburger").removeClass("is-active");
  let scrollableNav = document.querySelector("#navbarMain");
  enableBodyScroll(scrollableNav);
});
//#endregion

//#region stickybar
document.addEventListener("DOMContentLoaded", function () {
  new hcSticky(".stickybar", {
    stickTo: "body",
    stickyClass: "stickybar--sticked",
  });
});
//#endregion

//#region slider
$(function () {
  $(".slider").slick({
    arrows: false,
    centerMode: true,
    variableWidth: true,
  });
});
//#endregion

//#region calendar
$(function () {
  let events = [
    {
      date: new Date(),
      html: "<p>evento</p>",
    },
    {
      date: new Date(),
      html: "<p>evento</p>",
    },
    {
      date: new Date(),
      html: "<p>evento</p>",
    },
    {
      date: new Date(),
      html: "<p>evento</p>",
    },
  ];
  new Moncal(events);
});
//#endregion
