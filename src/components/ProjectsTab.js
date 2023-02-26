import React, { useState } from "react";
import { useSettings } from "./SettingsHOC";

const isWindows = /Win/i.test(navigator.platform);
const lineSep = isWindows ? "\r\n" : "\n";

const ProjectsTab = () => {
  const [settings, setSetting] = useSettings();
  const [projects, setProjects] = useState(settings["projects"] || []);
  const [isDraft, setIsDraft] = useState(false);

  const parseLines = (e) => {
    const v = e.target.value;
    const newProjects = v.split(/\r?\n/);
    setProjects(newProjects);
    const hasChanged = newProjects.some((project, idx) => {
      if (settings["projects"]) {
        return settings["projects"].at(idx) !== project;
      } else {
        return !!project;
      }
    });
    if (hasChanged) {
      setIsDraft(true);
    } else {
      setIsDraft(false);
    }
  };

  const lines = projects.join(lineSep);

  const saveProjects = () => {
    setSetting("projects", projects);
    setIsDraft(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <p>Instructions: Write each project in a new line then hit Save.</p>
      <div className="w-full h-full">
        <textarea
          onChange={parseLines}
          value={lines}
          placeholder={"Project 1\nProject 2\nProject 3\n..."}
          className="w-full h-56 text-sm resize-none py-1 px-2 border border-gray-400 border-solid rounded outline-none"
        />
      </div>
      {isDraft && (
        <button
          className="text-factorial p-1 rounded border-2 border-solid border-factorial cursor-pointer self-center"
          onClick={saveProjects}
        >
          Save Projects
        </button>
      )}
    </div>
  );
};

export default ProjectsTab;
