import React, { useState, useMemo } from "react";
import Employee from "../API/Employee";
import { useFactorial } from "./FactorialHOC";
import Form, { Label } from "./Form";
import Select from "react-select";
import { useSettings } from "./SettingsHOC";
import Renderer from "../Renderer";

const FormTab = () => {
  const [settings, setSetting] = useSettings();
  const { factorial } = useFactorial();

  const projects = settings["projects"];
  const allAllocations = settings["allocations"];

  const employees = useMemo(
    () =>
      factorial.getEmployees().map((em) => {
        em = new Employee(em);
        return em;
      }),
    [factorial]
  );

  const [employee, setEmployee] = useState(employees.at(0));
  allAllocations && employee.setAllocations(allAllocations[employee.id]);

  const onSubmit = async (data) => {
    const { month, year, allocations } = data;
    // employee.setAllocations(allocations);
    if (allocations.length > 0) {
      setSetting("allocations", {
        ...allAllocations,
        [employee.id]: allocations,
      });

      (await Renderer.toPDF(employee, month, year)).download();
    } else {
      alert(
        "You have 0 allocations. Please allocate a project for " + employee.name
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="my-1 w-full px-2 grid grid-cols-12">
        <Label label="Employee" className="col-span-2" htmlFor="ts-em-select" />
        <Select
          inputId="ts-em-select"
          className="col-span-10"
          name="employee"
          options={employees}
          value={employee}
          placeholder="Pick an Employee"
          getOptionLabel={(em) => em.name}
          getOptionValue={(em) => em.id}
          onChange={(em) => setEmployee(em)}
        />
      </div>
      <Form
        projects={projects || []}
        allocations={employee?.allocations || []}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default FormTab;
