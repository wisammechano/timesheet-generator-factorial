import dayjs from "dayjs";
import Factorial from "../API/Factorial";
import { MRound } from "../utils";

const extractLeaveById = (VacID, vacations) => {
  const vacsDuration = vacations
    .filter((v) => v.type === VacID)
    .reduce((a, v) => a + v.duration, 0);
  const hasThisLeave = vacsDuration > 0;
  return hasThisLeave ? [vacsDuration, vacsDuration.toFixed(2)] : [0, ""];
};

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
  work_hours: function ({ vacations, isOffDay }) {
    if (isOffDay) return "";

    const vacsDuration = vacations.reduce((a, v) => a + v.duration, 0);

    const workHrs = this.employee.workingHrs - vacsDuration;
    return [workHrs, workHrs.toFixed(2)];
  },
  leave_parental: function ({ vacations, isOffDay }) {
    if (isOffDay) return "";

    const VacID = Factorial.LEAVES.PARENTAL.name;

    return extractLeaveById(VacID, vacations);
  },
  leave_parental_sick: function ({ vacations, isOffDay }) {
    if (isOffDay) return "";

    // not tracked on factorial
    // const VacID = "BlahBlahBlah"

    return [0, ""]; //extractLeaveById(VacID, vacations)
  },
  leave_compassionate: function ({ vacations, isOffDay }) {
    if (isOffDay) return "";

    // has 2 names on factorial
    const VacID1 = Factorial.LEAVES.COMPASSIONATE.name;
    const VacID2 = "compassionate";

    const [duration1] = extractLeaveById(VacID1, vacations);
    const [duration2] = extractLeaveById(VacID2, vacations);
    const totalDuration = duration1 + duration2;
    const isCompassionate = totalDuration > 0;

    return isCompassionate
      ? [totalDuration, totalDuration.toFixed(2)]
      : [0, ""];
  },
  leave_sick: function ({ vacations, isOffDay }) {
    if (isOffDay) return "";
    const VacID = Factorial.LEAVES.SICK.name;

    return extractLeaveById(VacID, vacations);
  },
  leave_vacation: function ({ vacations, isOffDay }) {
    if (isOffDay) return "";
    const VacID = Factorial.LEAVES.HOLIDAY.name;

    return extractLeaveById(VacID, vacations);
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
  return MRound(allocation * workingHrs, 0.01);
}
