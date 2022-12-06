import jquery from "jquery";
window.jQuery = window.$ = jquery;

import * as Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

// Bootstrap Framework
import "./scss/index.scss";
import "@popperjs/core";
import "bootstrap";

import "slick-carousel";
import hcSticky from "hc-sticky";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { getDaysInAMonth } from "./moncal";

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

  function initMoncalJs(
    $moncalEl = $("[data-moncaljs]"),
    year = moment().get("year"),
    month = moment().get("month")
  ) {
    let currYear = year;
    let currMonth = month;

    $moncalEl.empty();

    let prevYear;
    let prevMonth;
    let nextYear;
    let nextMonth;
    switch (currMonth) {
      case 0:
        prevMonth = 11;
        prevYear = currYear - 1;
        nextMonth = currMonth + 1;
        nextYear = currYear;
        break;
      case 11:
        nextMonth = 0;
        nextYear = currYear + 1;
        prevMonth = currMonth - 1;
        prevYear = currYear;
        break;
      default:
        prevMonth = currMonth - 1;
        nextMonth = currMonth + 1;
        prevYear = currYear;
        nextYear = currYear;
        break;
    }

    let htmlHeader = `
    <div class="moncaljs__header">
      <div class="moncaljs__action moncaljs__action--prev" data-month="${prevMonth}" data-year="${prevYear}"></div>
      <div class="moncaljs__action moncaljs__action--next" data-month="${nextMonth}" data-year="${nextYear}"></div>
      <div class="moncaljs__title">${moment()
        .month(currMonth)
        .format("MMMM")} ${currYear}</div>
    </div>
    `;

    let weeks = getDaysInAMonth(currYear, currMonth);

    let htmlDays = "";

    weeks.forEach((week) => {
      week.forEach((day) => {
        let dayEvents = events.filter(
          (e) =>
            moment(e.date).format("YYYYMMDD") == moment(day).format("YYYYMMDD")
        );
        let htmlDayEvents = "";
        if (dayEvents.length > 0) {
          dayEvents.forEach((event) => {
            htmlDayEvents += `
              <div class="moncaljs__grid__day__event">
                ${event.html}
              </div>
            `;
          });
        }
        htmlDays += `
        <div class="moncaljs__grid__day ${
          moment(day).get("month") < currMonth
            ? "moncaljs__grid__day--prev"
            : moment(day).get("month") > currMonth
            ? "moncaljs__grid__day--next"
            : ""
        }">
          <span class="moncaljs__grid__day__number">
          ${moment(day).format("DD")} 
            <span>${moment(day).format("dd")}</span>
          </span>
          ${htmlDayEvents}
        </div>
        `;
      });
    });

    let htmlDayNames = "";

    weeks[0].forEach((day) => {
      htmlDayNames += `
      <div class="moncaljs__grid__head">
        ${moment(day).format("dddd")}
      </div>`;
    });

    let htmlGrid = `
    <div class="moncaljs__grid">
        ${htmlDayNames}
        ${htmlDays}
    </div>
    `;

    $moncalEl.append(htmlHeader).append(htmlGrid);
  }

  $("body").on("click", ".moncaljs__action--prev", function () {
    let $el = $(this).parent().parent("[data-moncaljs]");
    let year = $(this).data("year");
    let month = $(this).data("month");
    initMoncalJs($el, year, month);
  });
  $("body").on("click", ".moncaljs__action--next", function () {
    let $el = $(this).parent().parent("[data-moncaljs]");
    let year = $(this).data("year");
    let month = $(this).data("month");
    initMoncalJs($el, year, month);
  });

  initMoncalJs();
});
//#endregion
