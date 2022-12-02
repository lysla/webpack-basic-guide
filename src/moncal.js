import * as Moment from "moment";
import { extendMoment } from "moment-range";
export const getDaysInAMonth = (
  year = +Moment().format("YYYY"),
  month = +Moment().format("MM") - 1
) => {
  const moment = extendMoment(Moment);
  const startDate = moment([year, month]);

  const firstDay = moment(startDate).startOf("month");
  const endDay = moment(startDate).endOf("month");

  const monthRange = moment.range(firstDay, endDay);
  const weeks = [];
  const days = Array.from(monthRange.by("day"));
  days.forEach((it) => {
    if (!weeks.includes(it.week())) {
      weeks.push(it.week());
    }
  });

  const calendar = [];
  weeks.forEach((week) => {
    const firstWeekDay = moment([year, month]).week(week).day(0);
    const lastWeekDay = moment([year, month]).week(week).day(6);
    const weekRange = moment.range(firstWeekDay, lastWeekDay);
    calendar.push(Array.from(weekRange.by("day")));
  });

  return calendar;
};
