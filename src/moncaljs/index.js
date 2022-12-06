import * as Moment from "moment";
import "moment/locale/it";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export const Moncal = function (events, el, options) {
  function getDaysInAMonth(
    year = +Moment().format("YYYY"),
    month = +Moment().format("MM") - 1
  ) {
    const startDate = moment([year, month]);

    const firstDay = moment(startDate).startOf("month");
    const endDay = moment(startDate).endOf("month");

    const monthRange = moment.range(firstDay, endDay);
    const weeks = [];
    const days = Array.from(monthRange.by("day"));
    days.forEach((it) => {
      if (!weeks.includes(it.isoWeek())) {
        weeks.push(it.isoWeek());
      }
    });

    const calendar = [];
    weeks.forEach((week) => {
      const firstWeekDay = moment([year, month]).isoWeek(week).isoWeekday(1);
      const lastWeekDay = moment([year, month]).isoWeek(week).isoWeekday(7);
      const weekRange = moment.range(firstWeekDay, lastWeekDay);
      calendar.push(Array.from(weekRange.by("day")));
    });

    return calendar;
  }

  function initMoncalJs(
    $moncalEl = el ? $(el) : $("[data-moncaljs]"),
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
};
