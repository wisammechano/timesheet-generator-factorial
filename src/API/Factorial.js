import dayjs from "dayjs";
import Employee from "./Employee";

const get = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

class Factorial {
  static weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  static instance;

  constructor() {
    this.employees = [];
    this.users = [];
  }

  static async load() {
    if (window?.factorialInstance) {
      return window.factorialInstance;
    } else if (Factorial.instance) {
      return Factorial.instance;
    }

    const instance = new Factorial();

    try {
      instance.employees = await get("https://api.factorialhr.com/employees");
      instance.users = await get("https://api.factorialhr.com/accesses");
    } catch (err) {
      console.error(err);
      return;
    }

    const terminatedUsers = [];

    instance.employees = instance.employees.filter((em) => {
      const remove = em.terminated_on || em.is_terminating;
      remove && terminatedUsers.push(em.access_id);
      return !remove;
    });

    instance.users = instance.users.filter(
      (user) => !terminatedUsers.includes(user.id)
    );

    instance.initialized = true;

    if (window) {
      window.factorialInstance = instance;
    } else {
      Factorial.instance = instance;
    }

    instance.currentUser = instance.users.find((u) => u.current);
    instance.currentEmployee = new Employee(
      instance.getEmployeeByUserId(instance.currentUser.id)
    );

    return instance;
  }

  static getInstance() {
    const instance = window?.factorialInstance || Factorial.instance;
    if (instance && instance.initialized) {
      return instance;
    }
    throw new Error("Instance is not initialized. Please call .load()");
  }

  getEmployee(id) {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");

    return this.employees.find((e) => e.id?.toString() === id?.toString());
  }

  getEmployees() {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");

    return this.employees;
  }

  getUser(id) {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");
    return this.users.find((e) => e.id?.toString() === id?.toString());
  }

  getUsers() {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");
    return this.users;
  }

  getEmployeeByUserId(id) {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");

    return this.employees.find(
      (e) => e.access_id?.toString() === id?.toString()
    );
  }

  static async getLeaves(employeeId, refYear) {
    let year = refYear.year();

    const fromCurrent = dayjs(year.toString()).format("YYYY-MM-DD");
    const toCurrent = dayjs((year + 1).toString())
      .set("date", 0)
      .format("YYYY-MM-DD");

    const resCurrent = await get(
      `https://api.factorialhr.com/leaves?employee_id=${employeeId}&terminated=true&from=${fromCurrent}&to=${toCurrent}`
    );

    /*
    const fromPast = dayjs((year - 1).toString()).format("YYYY-MM-DD");
    const toPast = dayjs(year.toString()).set("date", 0).format("YYYY-MM-DD");

    const resPast = await get(
      `https://api.factorialhr.com/leaves?employee_id=${employeeId}&terminated=true&from=${fromPast}&to=${toPast}`
    );
    
    const leaves = [...resPast, ...resCurrent];

    return this.parseLeaves(leaves);
    */

    return Factorial.parseLeaves(resCurrent);
  }

  static async getContracts(employeeId) {
    return await get(
      `https://api.factorialhr.com/contracts/contract_versions?employee_ids[]=${employeeId}`
    );
  }

  static parseLeaves(leaves) {
    // returns array of leaves per day
    const data = [];
    for (const leave of leaves) {
      const {
        approved,
        start_on,
        finish_on,
        half_day,
        type,
        leave_type_id,
        id,
      } = leave;
      const startOn = dayjs(start_on);
      const finishOn = dayjs(finish_on);
      const isHalfDay = half_day !== null;
      const length = finishOn.diff(startOn, "days") + 1; // finishOn is included
      data.push({
        approved,
        startOn,
        finishOn,
        length,
        isHalfDay,
        halfDay: half_day,
        type,
        typeId: leave_type_id,
        id,
      });
    }

    return data;
  }

  static LEAVES = {
    HOLIDAY: {
      id: 559378,
      name: "holiday",
      identifier: "holiday",
      approval_required: true,
      accrues: true,
      visibility: true,
      active: true,
    },
    SICK: {
      id: 559380,
      name: "sick",
      identifier: "sick",
      approval_required: false,
      accrues: true,
      visibility: true,
      active: true,
    },
    PARENTAL: {
      id: 559382,
      name: "parental",
      identifier: "parental",
      approval_required: true,
      accrues: true,
      visibility: true,
      active: true,
    },
    IN_LIEU: {
      id: 579032,
      name: "In Lieu",
      identifier: "custom",
      approval_required: true,
      accrues: false,
      visibility: true,
      active: true,
    },
    UNPAID: {
      id: 1292260,
      name: "Unpaid",
      identifier: "custom",
      approval_required: true,
      accrues: true,
      visibility: false,
      active: true,
    },
    COMPASSIONATE: {
      id: 1292271,
      name: "Compassionate Paid",
      identifier: "custom",
      approval_required: true,
      accrues: true,
      visibility: true,
      active: true,
    },
    COMPASSIONATE_UNPAID: {
      id: 1292272,
      name: "Compassionate Unpaid",
      identifier: "custom",
      approval_required: true,
      accrues: true,
      visibility: true,
      active: true,
    },
  };
}

export default Factorial;
