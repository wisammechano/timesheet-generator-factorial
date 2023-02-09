const pdf = require("pdfjs");
const font = require("pdfjs/font/Helvetica");
const { Factorial } = require("./factorial");
const logo = require("../assets/logo.jpg");
const Buffer = require("buffer/").Buffer; // note: the trailing slash is important!

const PAGE_WIDTH = 29.71 * pdf.cm;
const PAGE_HEIGHT = 21 * pdf.cm;
const PAGE_PADDING = 0.5 * pdf.cm;

async function generateDoc(employee, allocations, refDate) {
  const doc = new pdf.Document({
    font,
    padding: PAGE_PADDING,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    fontSize: 5,
  });

  await generateHead(doc, employee, refDate);

  const table = doc.table({
    widths: sheetHeaders.map((h) => h.width),
    borderWidth: 0.5,
    borderColor: 0xdddddd,
  });

  const header = table.header();

  sheetHeaders.forEach((t, i) => {
    let text = t.text;
    if (text.toLowerCase().includes("project #")) {
      const index = parseInt(text.slice(text.length - 1), 10) - 1;
      text = allocations[index] ? allocations[index].name : text;
    }
    header.cell(text, header_props);
  });

  const daysInMonth = refDate.daysInMonth();
  const totals = Object.keys(Factorial.LEAVES).reduce(
    (obj, leaveKey) => {
      const leaveName = Factorial.LEAVES[leaveKey].name;
      obj[leaveName] = 0;
      return obj;
    },
    {
      workHours: 0,
      parentalSick: 0,
      totalHours: 0,
      compassionate: 0,
      project1: 0,
      project2: 0,
      project3: 0,
      project4: 0,
      project5: 0,
    }
  );

  for (let i = 0; i < daysInMonth; i++) {
    const day = refDate.clone().set("date", i + 1);
    generateBodyRow(
      table,
      employee,
      day,
      allocations,
      i % 2 === 0 ? 0xffffff : 0xfff7fa,
      totals
    );
  }

  // summary row
  const totalsRow = table.row(total_props);
  totalsRow.cell("TOTAL HOURS", {
    textAlign: "right",
    colspan: 4,
    paddingRight: 3,
  });

  // total work hours
  totalsRow.cell(totals.workHours.toString(), {
    textAlign: "center",
  });

  // total parental days
  totalsRow.cell(totals[Factorial.LEAVES.PARENTAL.name].toString(), {
    textAlign: "center",
  });

  // total parental sick
  totalsRow.cell(totals.parentalSick.toString(), {
    textAlign: "center",
  });

  // total compassionate
  const total =
    (totals[Factorial.LEAVES.COMPASSIONATE.name] || 0) +
    (totals["compassionate"] || 0);
  totalsRow.cell(total.toString(), {
    textAlign: "center",
  });

  // total sick
  totalsRow.cell(totals[Factorial.LEAVES.SICK.name].toString(), {
    textAlign: "center",
  });

  // total vacation
  totalsRow.cell(totals[Factorial.LEAVES.HOLIDAY.name].toString(), {
    textAlign: "center",
  });

  // total hours
  totalsRow.cell(totals.totalHours.toString(), {
    textAlign: "center",
  });

  // total project1
  totalsRow.cell(totals.project1.toFixed(2), {
    textAlign: "center",
  });

  // total project2
  totalsRow.cell(totals.project2.toFixed(2), {
    textAlign: "center",
  });

  // total project3
  totalsRow.cell(totals.project3.toFixed(2), {
    textAlign: "center",
  });

  // total project4
  totalsRow.cell(totals.project4.toFixed(2), {
    textAlign: "center",
  });

  // total project5
  totalsRow.cell(totals.project5.toFixed(2), {
    textAlign: "center",
  });

  // allocations row
  const allocationsRow = table.row({
    fontSize: 4,
    borderWidth: 0,
    borderColor: 0xffffff,
  });

  allocationsRow.cell("% allocations", {
    textAlign: "right",
    colspan: 11,
    paddingRight: 3,
  });

  // project 1
  new Array(5).fill(0).forEach((_, i) => {
    const a = allocations[i] ? allocations[i].percent : 0;
    const percent = a * 100 + "%";
    allocationsRow.cell(percent, {
      textAlign: "center",
      backgroundColor: 0xffffaa,
    });
  });

  generateFooter(doc, employee);

  return doc;
}

function generateFooter(doc, employee) {
  // put other details in a table
  const table = doc.table({
    widths: new Array(10).fill((PAGE_WIDTH - PAGE_PADDING * 2) / 10), // 10 cells of 2 cm
    borderWidth: 0,
    fontSize: 10,
  });

  // row 1
  const row1 = table.row({
    paddingTop: 1 * pdf.cm,
    color: 0x444444,
  });

  row1.cell("Approved by the manager", {
    colspan: 8,
  });

  row1.cell("Signed by employee", {
    colspan: 2,
  });

  // row 2
  const row2 = table.row({
    paddingTop: 1.5 * pdf.cm,
    paddingBottom: 1 * pdf.cm,
    color: 0x444444,
  });

  row2.cell(employee.managerName, {
    colspan: 8,
  });

  row2.cell(employee.name, {
    colspan: 2,
  });
}

async function generateHead(doc, employee, refDate) {
  let fimgb = dataUriToBuffer(logo);
  const img = new pdf.Image(fimgb);

  const imageHeight = 0.8 * pdf.cm;
  doc.image(img, {
    height: imageHeight,
    align: "left",
    y: PAGE_HEIGHT - PAGE_PADDING,
  });

  // put other details in a table
  const table = doc.table({
    widths: new Array(10).fill((PAGE_WIDTH - PAGE_PADDING * 2) / 10), // 10 cells of 2 cm
    borderWidth: 0,
  });

  // row 1
  const row1 = table.row({
    paddingTop: 1 * pdf.cm,
    paddingBottom: 0.3 * pdf.cm,
  });
  row1.cell("Monthly Time Sheet", {
    fontSize: 12,
    colspan: 6,
    textAlign: "left",
  });
  row1.cell("Month:", {
    fontSize: 10,
    colspan: 2,
    textAlign: "right",
    color: 0x888888,
  });
  row1.cell(refDate.format("MMMM"), {
    fontSize: 10,
    colspan: 2,
    textAlign: "center",
    borderBottomWidth: 1 * pdf.mm,
    color: 0x555555,
    borderBottomColor: 0x888888,
  });

  // row 2
  const row2 = table.row({
    paddingTop: 0.125 * pdf.cm,
    paddingBottom: 0.25 * pdf.cm,
  });
  row2.cell("Employee:", {
    fontSize: 10,
    colspan: 1,
    textAlign: "left",
    color: 0x888888,
  });
  row2.cell(employee.name, {
    fontSize: 10,
    colspan: 5,
    textAlign: "left",
    borderBottomWidth: 1 * pdf.mm,
    color: 0x555555,
    borderBottomColor: 0x888888,
  });

  row2.cell("Start Date of First Week:", {
    fontSize: 10,
    colspan: 2,
    textAlign: "right",
    color: 0x888888,
  });

  const { hiredOn } = employee;
  const startDate = hiredOn.unix() >= refDate.unix() ? hiredOn : refDate;
  row2.cell(startDate.format("ddd DD/MMM YY"), {
    fontSize: 10,
    colspan: 2,
    textAlign: "center",
    borderBottomWidth: 1 * pdf.mm,
    color: 0x555555,
    borderBottomColor: 0x888888,
  });
}

function generateBodyRow(table, employee, day, allocations, rowColor, totals) {
  const weekend = employee.isWeekend(day);
  const vacation = employee.getLeaveHours(day);
  const hiredOn = employee.hiredOn;
  if (day.unix() < hiredOn.unix()) return; //skip past days

  const backgroundColor = weekend ? 0xfddce8 : rowColor;
  const row = table.row({
    backgroundColor,
  });

  // Date Cell
  row.cell(day.format("ddd DD/MMM YY"), { ...row_props });

  if (weekend) {
    for (let j = 0; j < sheetHeaders.length - 1; j++) {
      row.cell("", { ...row_props });
    }
    return;
  }

  // Start Time Cell
  row.cell("09:00", { ...row_props });

  // Lunch Breaks
  row.cell("1", { ...row_props });

  // Finish Time
  row.cell("06:00", { ...row_props });

  // Work Hours
  totals.workHours += employee.workingHrs - vacation.duration;
  row.cell((employee.workingHrs - vacation.duration).toFixed(2), {
    ...row_props,
  });

  // Parental Leave
  const isParental = vacation.type === Factorial.LEAVES.PARENTAL.name;
  if (isParental) {
    totals[vacation.type] += vacation.duration;
  }
  row.cell(isParental ? vacation.duration.toFixed(2) : "", { ...row_props });

  // Parental Sick Leave
  const isParentalSick = false;
  if (isParentalSick) {
    totals[vacation.type] += vacation.duration;
  }
  row.cell("", { ...row_props });

  // Compassionate Leave
  const isCompassionate =
    vacation.type === Factorial.LEAVES.COMPASSIONATE.name ||
    vacation.type === "compassionate";
  if (isCompassionate) {
    totals[vacation.type] += vacation.duration;
  }
  row.cell(isCompassionate ? vacation.duration.toFixed(2) : "", {
    ...row_props,
  });

  // Sick Leave
  const isSick = vacation.type === Factorial.LEAVES.SICK.name;
  if (isSick) {
    totals[vacation.type] += vacation.duration;
  }
  row.cell(isSick ? vacation.duration.toFixed(2) : "", {
    ...row_props,
  });

  // Vacation
  const isVacation = vacation.type === Factorial.LEAVES.HOLIDAY.name;
  if (isVacation) {
    totals[vacation.type] += vacation.duration;
  }
  row.cell(isVacation ? vacation.duration.toFixed(2) : "", { ...row_props });

  // Total Hours
  totals.totalHours += employee.workingHrs;
  row.cell(employee.workingHrs.toFixed(2), { ...row_props });

  // Project 1
  const allocation1 = allocations[0] ? allocations[0].percent : 0;
  const projectHours1 =
    0.25 * Math.ceil((allocation1 * employee.workingHrs) / 0.25);
  totals.project1 += projectHours1;
  row.cell(projectHours1.toFixed(2), { ...row_props });

  // Project 2
  const allocation2 = allocations[1] ? allocations[1].percent : 0;
  const projectHours2 =
    0.25 * Math.ceil((allocation2 * employee.workingHrs) / 0.25);
  totals.project2 += projectHours2;
  row.cell(projectHours2.toFixed(2), { ...row_props });

  // Project 3
  const allocation3 = allocations[2] ? allocations[2].percent : 0;
  const projectHours3 =
    0.25 * Math.ceil((allocation3 * employee.workingHrs) / 0.25);
  totals.project3 += projectHours3;
  row.cell(projectHours3.toFixed(2), { ...row_props });

  // Project 4
  const allocation4 = allocations[3] ? allocations[3].percent : 0;
  const projectHours4 =
    0.25 * Math.ceil((allocation4 * employee.workingHrs) / 0.25);
  totals.project4 += projectHours4;
  row.cell(projectHours4.toFixed(2), { ...row_props });

  // Project 5
  const allocation5 = allocations[4] ? allocations[4].percent : 0;
  const projectHours5 =
    0.25 * Math.ceil((allocation5 * employee.workingHrs) / 0.25);
  totals.project5 += projectHours5;
  row.cell(projectHours5.toFixed(2), { ...row_props });
}

const row_props = {
  fontSize: 5,
  textAlign: "center",
};

const header_props = {
  textAlign: "center",
  paddingTop: 5,
  paddingBottom: 5,
  // paddingLeft: 5,
  // paddingRight: 5,
  color: 0xffffff,
  backgroundColor: 0x2f48be,
};

const total_props = {
  textAlign: "center",
  paddingTop: 2,
  paddingBottom: 2,
  fontSize: 5,
  // paddingLeft: 5,
  // paddingRight: 5,
  color: 0xffffff,
  backgroundColor: 0x2f48be,
};

const sheetHeaders = [
  {
    text: "DATE",
    width: 24.5 * pdf.mm,
  },
  {
    text: "START TIME",
    width: 17.5 * pdf.mm,
  },
  {
    text: "LUNCH/BREAKS (hours)",
    width: 17.5 * pdf.mm,
  },
  {
    text: "FINISH TIME",
    width: 17.5 * pdf.mm,
  },
  {
    text: "WORK HOURS",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PARENTAL LEAVE",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PARENTAL SICK LEAVE",
    width: 17.5 * pdf.mm,
  },
  {
    text: "COMPASSIONATE LEAVE",
    width: 17.5 * pdf.mm,
  },
  {
    text: "SICK LEAVE",
    width: 17.5 * pdf.mm,
  },
  {
    text: "VACATION",
    width: 17.5 * pdf.mm,
  },
  {
    text: "TOTAL HOURS",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PROJECT #1",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PROJECT #2",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PROJECT #3",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PROJECT #4",
    width: 17.5 * pdf.mm,
  },
  {
    text: "PROJECT #5",
    width: 17.5 * pdf.mm,
  },
];

function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError(
      '`uri` does not appear to be a Data URI (must begin with "data:")'
    );
  }

  // strip newlines
  uri = uri.replace(/\r?\n/g, "");

  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }

  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(";");

  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else if (meta[i]) {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  // defaults to US-ASCII only if type is not provided
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }

  // get the encoded data portion and decode URI-encoded chars
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);

  // set `.type` and `.typeFull` properties to MIME type
  buffer.type = type;
  buffer.typeFull = typeFull;

  // set the `.charset` property
  buffer.charset = charset;

  return buffer;
}

module.exports = { generateDoc, dataUriToBuffer };
