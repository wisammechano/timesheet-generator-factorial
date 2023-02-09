/*
Employee Data

leaves
name
manager
work hours
work days
*/

const dayjs = require("dayjs");

const get = (url) =>
  fetch(url, {
    credentials: "include",
  })
    .then((res) => res.json())
    .catch(console.error);

const exampleLeave = {
  id: 1430633,
  approved: true,
  employee_id: 430137,
  start_on: "2021-03-21",
  finish_on: "2021-06-13",
  half_day: null,
  hours_amount: null,
  start_time: null,
  hourly: false,
  reason: null,
  description: null,
  accrues_list: {
    2021: 61,
  },
  used_units: {
    days: {
      2021: 61,
    },
    hours: {
      2021: 488,
    },
  },
  workable_units: {
    days: {
      2021: 85,
    },
    hours: {
      2021: 680,
    },
  },
  accrues: true,
  finish_on_natural: "2021-06-13",
  created_at: 1615806311,
  updated_at: 1615806311,
  french_calendar_flag_enabled: false,
  leave_type_id: 559382,
  type: "parental",
  permissions: {
    approve: false,
    manage_documents: false,
    update: false,
    delete: false,
  },
};

const exampleEmployee = {
  access_id: 434884,
  birthday_on: "1990-11-28",
  job_title: "Lead Trainer (Level 4, Grade I)",
  hired_on: "2019-06-16",
  id: 430137,
  manager_id: 450082,
  managed_by_current: false,
  supervised_by_current: false,
  fiscal_country: "iq",
  legal_entity_currency: "USD",
  terminated_on: null,
  is_terminating: false,
  termination_reason_type: null,
  timeoff_policy_id: 189619,
  timeoff_manager_id: 450082,
  timeoff_supervised_by_current: false,
  tenure_start_date: null,
  location_id: 104060,
  employee_group_id: 100899,
  payroll_hiring_id: 450014,
  is_eligible_for_payroll: false,
  attendable: true,
  attendance_employees_setting_id: 37255,
  payment_frequency: "monthly",
  contract_id: null,
  preferred_name: null,
  has_regular_access: true,
  regular_access_starts_on: "2021-03-09",
  irpf: null,
  pronouns: null,
  show_birthday: true,
  permissions: {
    hirings: {
      read: true,
      edit: false,
      edit_gross_salary: false,
      see_gross_salary: true,
    },
    leaves: {
      read: true,
      create: true,
      approve: false,
      manage_documents: true,
      manage_incidences: false,
      update: true,
    },
    personal: { read: true, edit: true, edit_manager: false },
    termination: false,
    profile: { email: { read: true, edit: true } },
    preferred_name: { read: true },
    documents: { read: true, edit: true },
    custom_tables: { create: true, remove: false },
    work_schedule: { read: true, edit: false },
    payroll_supplements: {
      supplements: { read: false, create: false },
      observations: { read: false, create: false },
    },
    tasks: { read: true },
    expenses: { create: true, cards: { request: true } },
  },
  country: "iq",
  state: "Erbil",
  postal_code: "44017",
  city: "Arbil",
  address_line_1: "Lana City, Tower C, F0-3 Koya Road, Kasnazan",
  address_line_2: "",
  country_metadata: {},
  contact_name: "Awrad Nashat",
  contact_number: "+9647700448831",
  phone_number: "9647702710512.0",
  identifier: "199077853772",
  identifier_type: "passport",
  gender: "male",
  nationality: "iq",
  bank_number: "IQ71BBAC001368549258210",
  swift_bic: null,
  company_identifier: null,
  base_compensation_type: "monthly",
  base_compensation_amount_in_cents: 380000,
};

const exampleUser = {
  id: 434884,
  user_id: 422612,
  company_id: 91469,
  invited: true,
  invited_on: "2021-03-09",
  is_admin: false,
  role: "basic",
  current: true,
  calendar_token:
    "bf8fed89faf8b2be835cc5d9540041c7ee3679417a76d1411ac2fab7accce392",
  permissions_group_id: 274089,
  can_login: true,
  first_name: "Wisam",
  last_name: "Naji",
  first_day_of_week: null,
  unconfirmed_email: null,
  joined: true,
  locale: "en",
  avatar:
    "/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNTQ0SXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1e0a677aeb73f23e40302e7f8933ed91bf632b00/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2QzNKbGMybDZaVWtpRGpFeU1GNTRNVEl3WGdZN0JsUTZER2R5WVhacGRIbEpJZ3REWlc1MFpYSUdPd1pVT2d0bGVIUmxiblJKSWd3eE1qQjRNVEl3QmpzR1ZEb1BZbUZqYTJkeWIzVnVaRG9RZEhKaGJuTndZWEpsYm5RNkVHRjFkRzlmYjNKcFpXNTBWQT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--dd9df74769900f0300f983059b25aeae8161242f/20210615_130747.jpg",
  avatar_full:
    "/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNTQ0SXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1e0a677aeb73f23e40302e7f8933ed91bf632b00/20210615_130747.jpg",
  tos: true,
  discoverability_widget_value: null,
  time_format: 24,
  mfa_enabled: false,
  email: "wisam@re-coded.com",
  nps_due: false,
  nps_attempt: 3,
  is_hiring_manager: false,
  test_groups: [],
};

const exampleContract = {
  id: 446419,
  employee_id: 430137,
  country: null,
  job_title: "Lead Trainer",
  job_catalog_level_id: null,
  starts_on: "2019-06-16",
  ends_on: null,
  effective_on: "2021-03-01",
  has_payroll: true,
  salary_amount: 390200,
  salary_frequency: "monthly",
  working_week_days: "monday,tuesday,wednesday,thursday,sunday",
  working_hours: 4000,
  working_hours_frequency: "week",
  es_has_teleworking_contract: false,
  es_cotization_group: null,
  es_contract_observations: null,
  es_job_description: null,
  has_trial_period: false,
  trial_period_ends_on: null,
  es_contract_type_id: null,
  es_working_day_type_id: null,
  es_education_level_id: null,
  es_professional_category_id: null,
  fr_employee_type: null,
  fr_forfait_jours: false,
  fr_jours_par_an: null,
  fr_coefficient: null,
  fr_contract_type_id: null,
  fr_level_id: null,
  fr_step_id: null,
  fr_mutual_id: null,
  fr_professional_category_id: null,
  fr_work_type_id: null,
  de_contract_type_id: null,
};

class Employee {
  constructor(employeeId, factorialInstance) {
    this.employeeId = employeeId;
    this.factorial = factorialInstance;
    const employee = this.factorial.getEmployee(this.employeeId);
    this.userId = employee.access_id;
    this.manager = this.factorial.getEmployee(employee.manager_id);
    this.managerProfile = this.factorial.getUser(this.manager.access_id);
    this.profile = this.factorial.getUser(this.userId);
    this.hiredOn = dayjs(employee.hired_on);
    this.leavesLoaded = [];
    this.leaves = [];
    this.name = `${this.profile.first_name} ${this.profile.last_name}`;
    this.managerName = `${this.managerProfile.first_name} ${this.managerProfile.last_name}`;
  }

  async fetchData() {
    let refYear = dayjs();
    if (this.factorial.refDate) {
      refYear = this.factorial.refDate;
    }

    // leaves
    const shouldFetchLeaves = !this.leavesLoaded.includes(refYear.year());
    if (shouldFetchLeaves) {
      const leaves = await this.factorial.getLeaves(this.employeeId, refYear);
      this.leaves = [...this.leaves, ...leaves];
      this.leavesLoaded.push(refYear.year());
    }

    // parse contract
    if (!this.contracts) {
      this.contracts = await this.factorial.getContracts(this.employeeId);
      this.currentContract = this.contracts[this.contracts.length - 1];
      this.workingDays = this.currentContract.working_week_days.split(",");
      this.weekendDays = Factorial.weekdays.filter(
        (day) => this.workingDays.indexOf(day) === -1
      );

      const workingHoursDaily = 8;
      const daysPerWeek = 5;
      const workingHoursWeekly = daysPerWeek * workingHoursDaily;

      this.workingHrsFreq = this.currentContract.working_hours_frequency;
      this.workingHrs =
        (this.workingHrsFreq === "week"
          ? this.currentContract.working_hours / daysPerWeek
          : this.currentContract.working_hours) / 100;

      this.workingHrsWeekly = this.workingHrs * daysPerWeek;

      this.isPartTime = this.workingHours < workingHoursWeekly;
    }
  }

  isWeekend(date) {
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
      if (leave.isHalfDay) {
        return {
          duration: this.workingHrs / 2,
          type: leave.type,
          approved: leave.approved,
        };
      }
      return {
        duration: this.workingHrs,
        type: leave.type,
        approved: leave.approved,
      };
    } else {
      return { type: "", duration: "" };
    }
  }
}

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
  static async load(refDate) {
    if (Factorial.instance) {
      let factorial = Factorial.instance;
      if (refDate.unix() !== factorial.refDate.unix()) {
        factorial.refDate = refDate;
        await factorial.currentEmployee.fetchData();
      }
      return factorial;
    }

    const instance = new Factorial();
    instance.refDate = refDate;

    instance.employees = await get("https://api.factorialhr.com/employees");
    instance.users = await get("https://api.factorialhr.com/accesses");

    instance.initialized = true;

    instance.currentUser = instance.users.find((u) => u.current);
    instance.currentEmployee = new Employee(
      instance.getEmployeeByUserId(instance.currentUser.id).id,
      instance
    );
    await instance.currentEmployee.fetchData();

    Factorial.instance = instance;

    return instance;
  }

  getEmployee(id) {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");

    return this.employees.find((e) => e.id === id);
  }

  getUser(id) {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");
    return this.users.find((e) => e.id === id);
  }

  getEmployeeByUserId(id) {
    if (!this.initialized)
      throw new Error("Instance is not initialized. Please call .load()");

    return this.employees.find((e) => e.access_id === id);
  }

  async getLeaves(employeeId, refYear) {
    let year = refYear.year();

    const fromCurrent = dayjs(year.toString()).format("YYYY-MM-DD");
    const toCurrent = dayjs((year + 1).toString())
      .set("date", 0)
      .format("YYYY-MM-DD");

    const fromPast = dayjs((year - 1).toString()).format("YYYY-MM-DD");
    const toPast = dayjs(year.toString()).set("date", 0).format("YYYY-MM-DD");

    const resCurrent = await get(
      `https://api.factorialhr.com/leaves?employee_id=${employeeId}&terminated=true&from=${fromCurrent}&to=${toCurrent}`
    );

    /*
    const resPast = await get(
      `https://api.factorialhr.com/leaves?employee_id=${employeeId}&terminated=true&from=${fromPast}&to=${toPast}`
    );
    
    const leaves = [...resPast, ...resCurrent];

    return this.parseLeaves(leaves);
    */

    return this.parseLeaves(resCurrent);
  }

  async getContracts(employeeId) {
    return await get(
      `https://api.factorialhr.com/contracts/contract_versions?employee_ids[]=${employeeId}`
    );
  }

  parseLeaves(leaves) {
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
      color: "07A2AD",
      company_id: 91469,
      approval_required: true,
      accrues: true,
      attachment: false,
      is_attachment_mandatory: false,
      visibility: true,
      editable: false,
      active: true,
      workable: false,
      allowance_ids: [94230, 98035, 208547, 208960, 208972],
      translated_name: "Holidays",
    },
    SICK: {
      id: 559380,
      name: "sick",
      identifier: "sick",
      color: "F5BA58",
      company_id: 91469,
      approval_required: false,
      accrues: true,
      attachment: true,
      is_attachment_mandatory: false,
      visibility: true,
      editable: false,
      active: true,
      workable: false,
      allowance_ids: [98035, 181951, 204901, 204921, 208964],
      translated_name: "Sick leave",
    },
    PARENTAL: {
      id: 559382,
      name: "parental",
      identifier: "parental",
      color: "FF9153",
      company_id: 91469,
      approval_required: true,
      accrues: true,
      attachment: false,
      is_attachment_mandatory: false,
      visibility: true,
      editable: false,
      active: true,
      workable: false,
      allowance_ids: [94230, 98035, 204912, 208965],
      translated_name: "Parental leave",
    },
    IN_LIEU: {
      id: 579032,
      name: "In Lieu",
      identifier: "custom",
      color: "FF9153",
      company_id: 91469,
      approval_required: true,
      accrues: false,
      attachment: false,
      is_attachment_mandatory: false,
      visibility: true,
      editable: true,
      active: true,
      workable: false,
      allowance_ids: [98035, 94230, 218086],
      translated_name: "In Lieu",
    },
    UNPAID: {
      id: 1292260,
      name: "Unpaid",
      identifier: "custom",
      color: "68CC45",
      company_id: 91469,
      approval_required: true,
      accrues: true,
      attachment: true,
      is_attachment_mandatory: false,
      visibility: false,
      editable: true,
      active: true,
      workable: false,
      allowance_ids: [204916, 204925, 208967],
      translated_name: "Unpaid",
    },
    COMPASSIONATE: {
      id: 1292271,
      name: "Compassionate Paid",
      identifier: "custom",
      color: "515164",
      company_id: 91469,
      approval_required: true,
      accrues: true,
      attachment: true,
      is_attachment_mandatory: false,
      visibility: true,
      editable: true,
      active: true,
      workable: false,
      allowance_ids: [204917, 204926, 208969],
      translated_name: "Compassionate Paid",
    },
    COMPASSIONATE_UNPAID: {
      id: 1292272,
      name: "Compassionate Unpaid",
      identifier: "custom",
      color: "515164",
      company_id: 91469,
      approval_required: true,
      accrues: true,
      attachment: true,
      is_attachment_mandatory: false,
      visibility: true,
      editable: true,
      active: true,
      workable: false,
      allowance_ids: [204917, 204926, 208969],
      translated_name: "Compassionate Unpaid",
    },
  };
}

module.exports = { Factorial, Employee };
