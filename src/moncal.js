import * as Moment from "moment";
import "moment/locale/it";
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
};
