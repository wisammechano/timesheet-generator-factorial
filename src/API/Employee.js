import dayjs from "dayjs";
import Factorial from "./Factorial";

class Employee {
  constructor(employeeId) {
    const factorial = Factorial.getInstance();

    let employee;

    if (isObject(employeeId)) {
      employee = employeeId;
      this.id = employee.id.toString();
    } else {
      this.id = employeeId;
      employee = factorial.getEmployee(this.id);
    }

    if (!employee) return;

    this.userId = employee.access_id.toString();
    this.manager = factorial.getEmployee(employee.manager_id);
    const hasManger = !!this.manager;
    this.hasManger = hasManger;
    if (hasManger) {
      this.managerProfile = factorial.getUser(this.manager?.access_id);
      this.managerName = `${this.managerProfile.first_name} ${this.managerProfile.last_name}`;
    }

    this.profile = factorial.getUser(this.userId);
    this.name = `${this.profile.first_name} ${this.profile.last_name}`;

    this.hiredOn = dayjs(employee.hired_on || "2017-01-01");
    this.isTerminated = !!employee.terminated_on;
    if (this.isTerminated) {
      this.terminatedOn = dayjs(employee.terminated_on);
    }
    this.leavesLoaded = [];
    this.leaves = [];
    this.loaded = false;
  }

  async fetchData(refYear) {
    // leaves
    const shouldFetchLeaves = !this.leavesLoaded.includes(refYear.year());
    if (shouldFetchLeaves) {
      const leaves = await Factorial.getLeaves(this.id, refYear);
      this.leaves = [...this.leaves, ...leaves];
      this.leavesLoaded.push(refYear.year());
    }

    // parse contract
    if (!this.contracts) {
      this.contracts = await Factorial.getContracts(this.id);
      this.currentContract = this.contracts.at(-1);
      this.workingDays = this.currentContract.working_week_days.split(",");
      this.weekendDays = Factorial.weekdays.filter(
        (day) => !this.workingDays.includes(day)
      );

      // working hours in factorial are 40 for all FT Employees
      const workingHoursDailyFullTime = 8;
      const daysPerWeekFullTime = 5;
      const workingHoursWeeklyFullTime =
        daysPerWeekFullTime * workingHoursDailyFullTime;

      // mostly weekly, could be otherwise. Considering daily
      this.workingHrsFreq = this.currentContract.working_hours_frequency;

      if (this.workingHrsFreq === "week") {
        // contract object hold hours as 4000
        this.workingHrs =
          this.currentContract.working_hours / this.workingDays.length / 100;
      } else if (this.workingHrsFreq === "day") {
        this.workingHrs = this.currentContract.working_hours / 100;
      } else {
        console.error("Unknown working hours frequency", this.workingHrsFreq);
        this.workingHrs = 8;
      }

      this.workingHrsWeekly = this.workingHrs * this.workingDays.length;

      this.isPartTime = this.workingHours < workingHoursWeeklyFullTime;

      this.loaded = true;
    }
  }

  isOffDay(date) {
    const day = dayjs(date).format("dddd").toLowerCase();
    return this.weekendDays.includes(day);
  }

  getLeaveHours(date) {
    const dateTs = dayjs(date).unix();
    const leave = this.leaves.find((leave) => {
      const { startOn, finishOn } = leave;
      if (dateTs >= startOn.unix() && dateTs <= finishOn.unix()) {
        return true;
      }
      return false;
    });

    if (leave && leave.approved) {
      const duration = leave.isHalfDay ? this.workingHrs / 2 : this.workingHrs;
      return {
        duration,
        type: leave.type,
        approved: leave.approved,
      };
    } else {
      return { type: "", duration: 0 };
    }
  }

  setAllocations(allocations) {
    this.allocations = allocations;
  }

  toJson() {
    const { name, managerName, id, userId, hiredOn, allocations } = this;
    return JSON.stringify({
      name,
      managerName,
      hiredOn,
      id,
      userId,
      allocations,
    });
  }

  static fromJson(json) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    const employee = new Employee(json.id);
    employee.setAllocations(json.allocations);

    return employee;
  }
}

function isObject(val) {
  return typeof val === "object" && val !== null;
}
export default Employee;
