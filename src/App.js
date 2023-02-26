import React, { useState } from "react";
import FAB from "./components/FAB";
import Modal from "./components/Modal";
import FormTab from "./components/FormTab";
import MeTab from "./components/MeTab";
import ProjectsTab from "./components/ProjectsTab";
import Tabs from "./components/Tabs";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="App">
      <FAB text="Fill Timesheets" onClick={() => setShowModal(true)} />
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Fill Timesheet"
      >
        <Tabs tabs={TABS}>
          <FormTab />
          <MeTab />
          <ProjectsTab />
        </Tabs>
      </Modal>
    </div>
  );
}

export default App;

const TABS = [
  {
    name: "All Employees",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 mb-1"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM7 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"
        />
        <path d="M2.226 18.342a1 1 0 0 0 1.728 1.008c2.7-4.63 9.391-4.63 12.092 0a1 1 0 0 0 1.728-1.008c-3.473-5.953-12.075-5.953-15.548 0zM16 4a1 1 0 1 0 0 2c1.33 0 2.429 1.094 2.429 2.467 0 1.372-1.098 2.466-2.429 2.466a1 1 0 1 0 0 2c2.456 0 4.429-2.01 4.429-4.466C20.429 6.01 18.456 4 16 4zM17.286 13.533a1 1 0 1 0 0 2c1.597 0 3.04 1.339 3.738 2.772a1 1 0 0 0 1.798-.877c-.862-1.767-2.848-3.895-5.536-3.895z" />
      </svg>
    ),
  },
  {
    name: "Me",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 mb-1"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 8a5 5 0 1 1 10 0A5 5 0 0 1 7 8zm5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5.954 19.35l-.09.154a1 1 0 0 1-1.728-1.008l.09-.154c3.473-5.953 12.075-5.953 15.548 0l.09.154a1 1 0 1 1-1.728 1.008l-.09-.154c-2.7-4.63-9.391-4.63-12.092 0z"
        />
      </svg>
    ),
  },
  {
    name: "Projects",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 mb-1"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 4a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm7 0H4v7h5V4zM2 17a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3zm7 0H4v3h5v-3zM15 2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5zm0 2h5v3h-5V4zM13 15.5a4.5 4.5 0 1 1 7.367 3.468 5.958 5.958 0 0 1 2.18 2.034l.294.457a1 1 0 0 1-1.682 1.082l-.294-.458c-1.575-2.449-5.155-2.449-6.73 0l-.294.458a1 1 0 0 1-1.682-1.082l.294-.457a5.958 5.958 0 0 1 2.18-2.034A4.49 4.49 0 0 1 13 15.5zm4.5-2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
        />
      </svg>
    ),
  },
];
