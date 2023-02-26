import React from "react";
import Renderer from "../Renderer";
import { useFactorial } from "./FactorialHOC";
import Form from "./Form";
import { useSettings } from "./SettingsHOC";

const MeTab = () => {
  const [settings, setSetting] = useSettings();
  const { factorial } = useFactorial();

  const projects = settings["projects"];
  const allAllocations = settings["allocations"];

  const employee = factorial.currentEmployee;
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
        employee.name + " has 0 allocations. Please allocate a project first"
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <h3>
        Employee: <strong>{employee.name}</strong>
      </h3>
      <Form
        projects={projects || []}
        allocations={employee?.allocations || []}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default MeTab;
