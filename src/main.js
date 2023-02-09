const { Factorial } = require("./factorial");
const dayjs = require("dayjs");
const { generateDoc } = require("./pdf");
const blobStream = require("blob-stream");
const { embed } = require("./embed");

const localStorageKey = "timesheetAllocations";
let allocations = [];
if (window?.localStorage) {
  const json = window.localStorage.getItem(localStorageKey);
  allocations = json ? JSON.parse(json) : [];
}

embed(allocations, (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const month = data.get("month");
  const year = data.get("year");

  // Apr 2021
  const refDate = dayjs(`${month} ${year}`);
  const allocations = [];

  // allocations
  for (let i = 0; i < 5; i++) {
    const id = (i + 1).toString();
    const proj = data.get("project" + id);
    const projAlloc = data.get("project" + id + "Alloc");
    if (proj && projAlloc) {
      allocations.push({
        name: proj,
        percent: Math.round(parseFloat(projAlloc) * 100) / 10000,
      });
    }
  }

  if (window?.localStorage) {
    window.localStorage.setItem(localStorageKey, JSON.stringify(allocations));
  }
  submit(allocations, refDate);
});

const submit = async (allocations, refDate) => {
  Factorial.load(refDate).then(async (factorial) => {
    if (window) {
      window.factorial = factorial;
    }

    const employee = factorial.currentEmployee;

    const doc = await generateDoc(employee, allocations, refDate);

    const fileName = `${
      employee.name
    } - Re-Coded - Timesheet - ${refDate.format("YYYY")} - ${refDate.format(
      "MMMM"
    )}`;

    const stream = blobStream();

    doc.pipe(stream);
    doc.end();

    stream.on("finish", (blob) => {
      blob = stream.toBlob("application/pdf");
      downloadBlob(blob, fileName);
    });
  });
};

function downloadBlob(blob, name) {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}
