import dayjs from "dayjs";
import PDF from "../PDF";
import { sheetColumns } from "./columns";
import { renderers } from "./renderers";

class Renderer {
  projectMatcher = /^project_([0-9]+)$/i;

  static async toPDF(employee, month, year) {
    const refDate = dayjs(`01 ${month} ${year}`);

    await employee.fetchData(refDate);

    const renderer = new Renderer(employee, refDate);
    renderer.stream = await renderer.pdf.toStream();

    renderer.fileName = `${
      employee.fullname
    } - Re-Coded - Timesheet - ${refDate.format("YYYY")} - ${refDate.format(
      "MMMM"
    )}`;

    return renderer;
  }

  constructor(employee, refDate) {
    this.employee = employee;
    this.refDate = refDate;
    this.pdf = new PDF();

    this.data = {};

    this.meta();

    this.header();
    this.rows();
    this.summary();
    this.allocations();

    this.pdf.generateName(this.data);
    this.pdf.generateTable(this.data);
    this.pdf.generateFooter(this.data);
  }

  meta() {
    const { fullname, managerName, hiredOn } = this.employee;

    const startDate = (
      hiredOn.unix() >= this.refDate.unix() ? hiredOn : this.refDate
    ).format("ddd DD/MMM YY");

    const month = this.refDate.format("MMMM");

    this.data.meta = {
      name: fullname,
      managerName,
      startDate,
      month,
    };
  }

  header() {
    this.data.totals = {};
    this.data.head = [];

    const renderProps = { textAlign: "center" };

    sheetColumns.forEach((col) => {
      // Parse project name place holders
      const projectMatches = col.id.match(this.projectMatcher);

      let value = col.value;

      if (projectMatches) {
        const idx = parseInt(projectMatches[1], 10);
        if (this.employee.allocations[idx - 1]) {
          value = this.employee.allocations[idx - 1].project;
        }
      }

      if (col.summarize) {
        this.data.totals[col.id] = 0;
      }

      this.data.head.push({ value, renderProps });
    });
  }

  rows() {
    this.data.rows = [];
    const daysInMonth = this.refDate.daysInMonth();
    const { hiredOn, terminatedOn } = this.employee;

    const renderProps = { textAlign: "center" };

    for (let i = 0; i < daysInMonth; i++) {
      const day = this.refDate.clone().set("date", i + 1);

      // Shouldn't generate rows for days before hireDate
      if (hiredOn && day.unix() < hiredOn.unix()) {
        continue;
      }

      // Shouldn't generate rows for days on and after terminationDate
      if (terminatedOn && day.unix() >= terminatedOn.unix()) {
        continue;
      }

      const vacations = this.employee.getLeaveHours(day);
      const isOffDay = this.employee.isOffDay(day);
      const columns = [];

      sheetColumns.forEach(({ id }) => {
        // we should only log date
        // render may return a tuple for numeric values to count totals
        const render = renderers[id].call(this, { day, vacations, isOffDay });
        let value = render;
        if (Array.isArray(render) && this.data.totals.hasOwnProperty(id)) {
          this.data.totals[id] += render[0];
          value = render[1];
        }

        columns.push({ value, renderProps });
      });

      const row = { columns, renderProps: {} };

      if (isOffDay) {
        row.renderProps.backgroundColor = 0xfddce8;
      }

      this.data.rows.push(row);
    }
  }

  summary() {
    // first column spans 4
    this.data.summary = [
      {
        value: "TOTAL HOURS",
        renderProps: {
          textAlign: "right",
          colspan: 4,
          paddingRight: 3,
        },
      },
    ];

    const renderProps = { textAlign: "center" };

    sheetColumns.forEach((col) => {
      const { id, summarize } = col;
      if (summarize) {
        this.data.summary.push({
          value: this.data.totals[id].toFixed(2),
          renderProps,
        });
      }
    });
  }

  allocations() {
    this.data.allocations = [
      {
        value: "% allocations",
        renderProps: {
          textAlign: "right",
          colspan: 11,
          paddingRight: 3,
        },
      },
    ];

    const renderProps = { textAlign: "center", backgroundColor: 0xffffaa };

    sheetColumns.forEach((col) => {
      const projectMatches = col.id.match(this.projectMatcher);
      if (projectMatches) {
        let value = "0.00%";
        const idx = parseInt(projectMatches[1], 10);
        if (this.employee.allocations[idx - 1]) {
          value =
            this.employee.allocations[idx - 1].allocation.toFixed(2) + "%";
        }
        this.data.allocations.push({ value, renderProps });
      }
    });
  }

  download(fileName) {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = this.stream.toBlobURL("application/pdf");

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = fileName || this.fileName;

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
}

export default Renderer;
