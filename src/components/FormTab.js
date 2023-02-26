import React, { useState, useMemo, memo } from "react";
import Employee from "../API/Employee";
import { useFactorial } from "./FactorialHOC";
import Form, { Label } from "./Form";
import Select from "react-select";
import { useSettings } from "./SettingsHOC";
import Renderer from "../Renderer";

import { months, strToObj } from "../utils";

const yearNow = new Date().getFullYear();
const monthNow = months.at(new Date().getMonth() - 1);
const years = new Array(4).fill(yearNow).map((y, i) => (y - i).toString());

const FormTab = ({ isCurrentEmployee = false }) => {
  const [settings, setSetting] = useSettings();
  const { factorial } = useFactorial();
  const [month, setMonth] = useState(monthNow);
  const [year, setYear] = useState(yearNow);

  const projects = settings["projects"];
  const allAllocations = settings["allocations"];

  const employees = useMemo(() => {
    if (isCurrentEmployee) {
      return [factorial.currentEmployee];
    } else {
      return factorial.getEmployees(month, year).map((em) => {
        em = new Employee(em);
        return em;
      });
    }
  }, [factorial, month, year, isCurrentEmployee]);

  const [employee, setEmployee] = useState(employees.at(0));
  allAllocations && employee.setAllocations(allAllocations[employee.id]);

  const onSubmit = async (data) => {
    const { allocations } = data;
    // employee.setAllocations(allocations);
    if (allocations.length > 0) {
      setSetting("allocations", {
        ...allAllocations,
        [employee.id]: allocations,
      });

      (await Renderer.toPDF(employee, month, year)).download();
    } else {
      alert(
        employee.displayName +
          " has 0 allocations. Please allocate a project first"
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="my-1 w-full px-2 grid grid-cols-12 gap-2 items-center">
        {isCurrentEmployee && (
          <h3 className="col-span-12">
            Employee: <strong>{employee.displayName}</strong>
          </h3>
        )}
        {/* Month Select */}
        <Label label="Month" htmlFor="ts-month-select" className="col-span-2" />
        <Select
          name="month"
          className="col-span-3"
          inputId="ts-month-select"
          defaultValue={strToObj(monthNow)}
          options={months.map(strToObj)}
          onChange={(month) => setMonth(month.value)}
        />

        {/* Year Select */}
        <Label
          label="Year"
          htmlFor="ts-year-select"
          className="col-start-7 col-span-2 justify-self-center"
        />
        <Select
          name="year"
          className="col-span-4"
          inputId="ts-year-select"
          defaultValue={strToObj(yearNow)}
          options={years.map(strToObj)}
          onChange={(year) => setYear(year.value)}
        />

        {!isCurrentEmployee && (
          <>
            {/* Employee Select */}

            <Label
              label="Employee"
              className="col-span-2"
              htmlFor="ts-em-select"
            />
            <Select
              inputId="ts-em-select"
              className="col-span-10"
              name="employee"
              options={employees}
              value={employee}
              placeholder="Pick an Employee"
              formatOptionLabel={(em) => (
                <div>
                  <span className="font-semibold">{em.displayName}</span>
                  {em.isTerminated && (
                    <span className="text-gray-400 ml-2">
                      (Terminated: {em.terminatedOn?.format("DD MMM YYYY")})
                    </span>
                  )}
                </div>
              )}
              getOptionLabel={(em) => em.displayName}
              getOptionValue={(em) => em.id}
              onChange={(em) => setEmployee(em)}
            />
          </>
        )}
      </div>
      <Form
        projects={projects || []}
        allocations={employee?.allocations || []}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default memo(FormTab);
