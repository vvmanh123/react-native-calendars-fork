import XDate from "xdate";

const { isToday, isDateNotInTheRange, sameMonth } = require('./dateutils');
const { parseDate, toMarkingFormat } = require('./interface');


export function getState(day: XDate, current: XDate, props: any) {
  const { minDate, maxDate, disabledByDefault, weekdayClose, dayClose, fromDate, toDate } = props;
  const _minDate = parseDate(minDate);
  const _maxDate = parseDate(maxDate);
  const weekday = day.getDay()
  const dateCurrent = day.setHours(0)
  let state = '';

  if (isToday(day)) {
    state = 'today';
  }

  if (fromDate) {
    let fromDateSelect = new XDate(fromDate, true).setHours(0)
    if (dateCurrent.getTime() === fromDateSelect.getTime()) {
      state = "selected"
    }
  }

  if (toDate) {
    let toDateSelect = new XDate(toDate, true).setHours(0)
    let fromDateSelect = fromDate ? new XDate(fromDate, true).setHours(0) : ""
    if (dateCurrent.getTime() === toDateSelect.getTime()) {
      state = "selected"
    }
    if (dateCurrent > fromDateSelect && dateCurrent < toDateSelect) {
      state = "inactive"
    }
  }

  if (weekdayClose) {
    const checkWeekday = weekdayClose.filter((i: any) => i?.weekday === weekday)?.length
    if (checkWeekday > 0) {
      if (isToday(day)) {
        state = 'disableToday';
      } else {
        state = 'disabled';
      }

    }
  }

  if (dayClose) {
    for (let index = 0; index < dayClose.length; index++) {
      const dateFromClose = dayClose[index]?.fromDate ? new XDate(dayClose[index]?.fromDate, true).setHours(0) : ""
      const dateEndClose = dayClose[index]?.toDate ? new XDate(dayClose[index]?.toDate, true).setHours(0) : ""
      if (dateCurrent >= dateFromClose && dateCurrent <= dateEndClose) {
        if (isToday(day)) {
          state = 'disableToday';
        } else {
          state = 'disabled';
        }
      }
    }
  }

  if (disabledByDefault) {
    state = 'disabled';
  } else if (isDateNotInTheRange(_minDate, _maxDate, day)) {
    state = 'disabled';
  } else if (!sameMonth(day, current)) {
    state = 'disabled';
  }

  return state;
}
