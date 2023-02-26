import dayjs from "dayjs";
import Factorial from "../API/Factorial";

export const renderers = {
  date: function ({ day }) {
    return day.format("ddd DD/MMM YY");
  },
  start_time: function ({ isOffDay }) {
    if (isOffDay) return "";
    return "09:00";
  },
  break: function ({ isOffDay }) {
    if (isOffDay) return "";
    return "1";
  },
  finish_time: function ({ isOffDay }) {
    if (isOffDay) return "";
    // normally 06:00
    // let's count it relative to working hours
    const workHrs = this.employee.workingHrs;
    const startTime = dayjs().set("hours", 9).set("minute", 0).set("second", 0);
    const breakHours = 1;
    const finishTime = startTime.add(workHrs + breakHours, "hour");

    return finishTime.format("hh:mm");
  },
  work_hours: function ({ vacation, isOffDay }) {
    if (isOffDay) return "";

    const workHrs = this.employee.workingHrs - vacation.duration;
    return [workHrs, workHrs.toFixed(2)];
  },
  leave_parental: function ({ vacation, isOffDay }) {
    if (isOffDay) return "";

    const isParental = vacation.type === Factorial.LEAVES.PARENTAL.name;
    return isParental
      ? [vacation.duration, vacation.duration.toFixed(2)]
      : [0, ""];
  },
  leave_parental_sick: function ({ vacation, isOffDay }) {
    if (isOffDay) return "";

    // not tracked on factorial
    const isParentalSick = false;
    return isParentalSick
      ? [vacation.duration, vacation.duration.toFixed(2)]
      : [0, ""];
  },
  leave_compassionate: function ({ vacation, isOffDay }) {
    if (isOffDay) return "";

    // has 2 names on factorial
    const isCompassionate =
      vacation.type === Factorial.LEAVES.COMPASSIONATE.name ||
      vacation.type === "compassionate";

    return isCompassionate
      ? [vacation.duration, vacation.duration.toFixed(2)]
      : [0, ""];
  },
  leave_sick: function ({ vacation, isOffDay }) {
    if (isOffDay) return "";

    const isSick = vacation.type === Factorial.LEAVES.SICK.name;
    return isSick ? [vacation.duration, vacation.duration.toFixed(2)] : [0, ""];
  },
  leave_vacation: function ({ vacation, isOffDay }) {
    if (isOffDay) return "";

    const isVacation = vacation.type === Factorial.LEAVES.HOLIDAY.name;
    return isVacation
      ? [vacation.duration, vacation.duration.toFixed(2)]
      : [0, ""];
  },
  total_hours: function ({ isOffDay }) {
    if (isOffDay) return "";

    const totalHrs = this.employee.workingHrs;
    return [totalHrs, totalHrs.toFixed(2)];
  },
  project_1: function ({ isOffDay }) {
    if (isOffDay) return "";

    const idx = 0;
    const { allocations, workingHrs } = this.employee;
    const allocation = allocations[idx] ? allocations[idx].allocation / 100 : 0;
    const projectHours = computeAllocation(allocation, workingHrs);

    return [projectHours, projectHours.toFixed(2)];
  },
  project_2: function ({ isOffDay }) {
    if (isOffDay) return "";

    const idx = 1;
    const { allocations, workingHrs } = this.employee;
    const allocation = allocations[idx] ? allocations[idx].allocation / 100 : 0;
    const projectHours = computeAllocation(allocation, workingHrs);

    return [projectHours, projectHours.toFixed(2)];
  },
  project_3: function ({ isOffDay }) {
    if (isOffDay) return "";

    const idx = 2;
    const { allocations, workingHrs } = this.employee;
    const allocation = allocations[idx] ? allocations[idx].allocation / 100 : 0;
    const projectHours = computeAllocation(allocation, workingHrs);

    return [projectHours, projectHours.toFixed(2)];
  },
  project_4: function ({ isOffDay }) {
    if (isOffDay) return "";

    const idx = 3;
    const { allocations, workingHrs } = this.employee;
    const allocation = allocations[idx] ? allocations[idx].allocation / 100 : 0;
    const projectHours = computeAllocation(allocation, workingHrs);

    return [projectHours, projectHours.toFixed(2)];
  },
  project_5: function ({ isOffDay }) {
    if (isOffDay) return "";

    const idx = 4;
    const { allocations, workingHrs } = this.employee;
    const allocation = allocations[idx] ? allocations[idx].allocation / 100 : 0;
    const projectHours = computeAllocation(allocation, workingHrs);

    return [projectHours, projectHours.toFixed(2)];
  },
};

function computeAllocation(allocation, workingHrs) {
  return 0.25 * Math.round((allocation * workingHrs) / 0.25);
}
