const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const yearNow = new Date().getFullYear();
const monthNow = months[new Date().getMonth()];
const years = new Array(4).fill(yearNow).map((y, i) => (y - i).toString());

let projectsCount = 0;

const fabId = "timesheetFab";
const formId = "timesheetForm";
const modalId = "timesheetModal";
const modalBodyId = "timesheetModalBody";
const modalCloseBtnId = "timesheetModalCloseBtn";
const formProjectsWrapperId = "timesheetFormProjects";
const formAddProjectBtnId = "timesheetFormAddProject";

const labelStyle = `padding: 0 5px; line-height: 30px; height: 30px;`;
const inputStyle = `padding: 5px 20px; min-width: 25px; border: 1px solid black; height: 30px; border-radius: 5px;`;

let form, modal, fab;

const embed = function (allocations = [], onSubmit) {
  const embeded = document.getElementById(modalId);
  if (embeded) return;

  fab = createFab();
  modal = createModal();
  form = createForm();

  const modalBody = modal.querySelector(`#${modalBodyId}`);
  modalBody.appendChild(form);

  form.querySelector(`#${formId}`).addEventListener("submit", onSubmit);
  const addProjBtn = form.querySelector(`#${formAddProjectBtnId}`);
  addProjBtn.addEventListener("click", () => addProject());

  if (allocations.length) {
    allocations.forEach((alloc) => {
      addProject(alloc.name, (alloc.percent * 100).toString());
    });
  } else {
    addProject();
  }

  document.body.appendChild(fab);
  document.body.appendChild(modal);
};

function addProject(name = "", percent = "") {
  projectsCount += 1;
  const div = document.createElement("div");
  div.style.margin = "10px 0";
  div.style.display = "flex";
  div.style.padding = "5px 0";
  div.innerHTML = `
  <div>
    <label for="project${projectsCount}Name" style="${labelStyle} margin-bottom: 10px; display: block;">Project ${projectsCount}:</label>
    <label for="project${projectsCount}Alloc" style="${labelStyle} display: block;">Allocation:</label>
  </div>
  <div>
    <input placeholder="Project Name" type="text" value="${name}" auto-complete="false" name="project${projectsCount}" id="project${projectsCount}Name" 
      style="${inputStyle} width: 100%; margin-bottom: 10px;">
    <input placeholder="Project Allocation (100)" min="0" max="100" type="number" value="${percent}" auto-complete="false" name="project${projectsCount}Alloc" id="project${projectsCount}Alloc" 
      style="${inputStyle} width: 100%">
  </div>
  <div style="height: 30px; line-height: 30px; align-self: end;">%</div>
  `;
  form.querySelector(`#${formProjectsWrapperId}`).appendChild(div);
}

function createFab() {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = fabId;
  const button = document.createElement("div");
  button.role = "button";
  button.style.boxShadow = "0 5px 15px rgb(0 0 0 / 5%)";
  button.style.cursor = "pointer";
  button.style.height = "60px";
  button.style.lineHeight = "60px";
  button.style.outline = "none";
  button.style.color = "#fff";
  button.style.fontWeight = "600";
  button.style.fontSize = "1rem";

  button.innerText = "Fill Timesheet";

  buttonContainer.style.position = "fixed";
  buttonContainer.style.bottom = "30px";
  buttonContainer.style.right = "100px";
  buttonContainer.style.zIndex = "994";
  buttonContainer.style.borderRadius = "30px";
  buttonContainer.style.width = "150px";
  buttonContainer.style.height = "60px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.backgroundImage =
    "linear-gradient(318.72deg,#FF355E 31.4%,#FFD7DF 178.48%),linear-gradient(316.92deg,#FF355E 15.62%,#FFD7DF 172.1%)";

  buttonContainer.appendChild(button);

  button.addEventListener("click", showFormModal);
  return buttonContainer;
}

function createModal() {
  const modalWrapper = document.createElement("div");
  modalWrapper.id = modalId;

  const modal = document.createElement("div");

  modalWrapper.style.position = "fixed";
  modalWrapper.style.display = "none";
  modalWrapper.style.top = 0;
  modalWrapper.style.bottom = 0;
  modalWrapper.style.right = 0;
  modalWrapper.style.left = 0;
  modalWrapper.style.zIndex = 1500;
  modalWrapper.style.backgroundColor = "rgba(0,0,0,0.5)";

  modal.style.width = "400px";
  modal.style.padding = "10px";
  modal.style.margin = "50px auto";
  modal.style.background = "#ffffff";
  modal.style.borderRadius = "10px";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";

  modal.innerHTML = `
  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center;">
  <h3 style="margin: 5px;">Download Timesheet</h3>
  <span role="button" id="${modalCloseBtnId}" style="padding: 5px; cursor: pointer; font-weight: 600; font-size: 2rem;">x</span>
  </div>
  <div id="${modalBodyId}" style="padding: 20px ;">
  </div>
  `;

  modalWrapper.appendChild(modal);

  modal
    .querySelector(`#${modalCloseBtnId}`)
    .addEventListener("click", hideFormModal);

  return modalWrapper;
}

function showFormModal() {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

function createForm() {
  const form = document.createElement("form");
  const formWrapper = document.createElement("div");

  form.id = formId;
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.justifyItems = "center";

  formWrapper.style.display = "flex";
  formWrapper.style.flexDirection = "column";
  formWrapper.style.justifyItems = "center";

  form.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; justify-content: space-around; margin: 10px 0;">
      <div style="display: flex; flex-wrap: wrap; padding: 5px 0;">
        <label for="monthPicker" style="${labelStyle}">Month:</label>
        <select name="month" id="monthPicker" style="${inputStyle}">
          ${months
            .map(
              (m) =>
                `<option value="${m}" ${
                  m === monthNow ? "selected" : ""
                }>${m}</option>`
            )
            .join("")}
        </select>
      </div>

      <div style="display: flex; flex-wrap: wrap; padding: 5px 0;">
        <label for="yearPicker" style="${labelStyle}">Year:</label>
        <select name="year" id="yearPicker" style="${inputStyle}">
          ${years
            .map(
              (y) =>
                `<option value="${y}" ${
                  y === yearNow.toString() ? "selected" : ""
                }>${y}</option>`
            )
            .join("")}
        </select>
      </div>
    </div>
    <button type="button" id="${formAddProjectBtnId}" style="color: #e51943; padding: 5px; border-radius: 5px; border: 2px solid #e51943; cursor: pointer;">Add another project</button>
    <div id="${formProjectsWrapperId}">
    </div>
  `;

  formWrapper.appendChild(form);
  formWrapper.innerHTML += `
  <div style="display: flex; justify-content: center; margin-top: 30px">
    <button type="submit" form="timesheetForm" 
      style="color: #e51943; padding: 5px; border-radius: 5px; border: 2px solid #e51943; cursor: pointer;">
      Download Timesheet
    </button>
  </div>
  `;

  return formWrapper;
}

function hideFormModal() {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

module.exports = { embed };
