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
    setSetting("allocations", {
      ...allAllocations,
      [employee.id]: allocations,
    });

    (await Renderer.toPDF(employee, month, year)).download();
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
