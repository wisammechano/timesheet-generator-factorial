import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Factorial from "./API/Factorial";
import FactorialHOC from "./components/FactorialHOC";
import SettingsHOC from "./components/SettingsHOC";

const rootId = "timesheet-gen-root";
const rootContainer = createRoot(rootId);

Factorial.load().then((factorial) => {
  window.factorialInstance = factorial;
  const root = ReactDOM.createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <SettingsHOC>
        <FactorialHOC>
          <App />
        </FactorialHOC>
      </SettingsHOC>
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});

function createRoot(id) {
  const attached = document.getElementById(id);
  if (attached) {
    return attached;
  }

  const root = document.getElementById(id) || document.createElement("div");
  root.id = id;
  document.body.appendChild(root);
  return root;
}
