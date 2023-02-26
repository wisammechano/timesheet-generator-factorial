import pdf, { Document } from "pdfjs";
import font from "pdfjs/font/Helvetica";
import logo from "../assets/logo.jpg";
import { dataUriToBuffer } from "../utils";
import BlobStream from "./BlobStream";

const PAGE_WIDTH = 29.71 * pdf.cm;
const PAGE_HEIGHT = 21 * pdf.cm;
const PAGE_PADDING = 0.5 * pdf.cm;

class PDF {
  constructor() {
    this.doc = new Document({
      font,
      padding: PAGE_PADDING,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    this.generateLogo();
  }

  generateLogo() {
    const imgBuffer = dataUriToBuffer(logo);
    const img = new pdf.Image(imgBuffer);

    const imgHeight = 0.8 * pdf.cm;
    this.doc.image(img, {
      height: imgHeight,
      align: "left",
      y: PAGE_HEIGHT - PAGE_PADDING,
    });
  }

  generateName(data) {
    // put other details in a table
    const { name, startDate, month } = data.meta;

    const table = this.doc.table({
      widths: new Array(10).fill((PAGE_WIDTH - PAGE_PADDING * 2) / 10), // 10 cells of 2 cm
      borderWidth: 0,
    });

    // Row 1
    const row1 = table.row({
      paddingTop: 1 * pdf.cm,
      paddingBottom: 0.3 * pdf.cm,
    });

    // Cells Row 1
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
    row1.cell(month, {
      fontSize: 10,
      colspan: 2,
      textAlign: "center",
      borderBottomWidth: 1 * pdf.mm,
      color: 0x555555,
      borderBottomColor: 0x888888,
    });

    // Row 2
    const row2 = table.row({
      paddingTop: 0.125 * pdf.cm,
      paddingBottom: 0.25 * pdf.cm,
    });

    // Cells Row 2
    row2.cell("Employee:", {
      fontSize: 10,
      colspan: 1,
      textAlign: "left",
      color: 0x888888,
    });
    row2.cell(name, {
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

    row2.cell(startDate, {
      fontSize: 10,
      colspan: 2,
      textAlign: "center",
      borderBottomWidth: 1 * pdf.mm,
      color: 0x555555,
      borderBottomColor: 0x888888,
    });
  }

  generateTable(data) {
    // all data should be render ready strings
    const { head, rows, summary, allocations } = data;

    if (rows.some((row) => row.columns.length !== head.length)) {
      throw new Error("Row cells and head cells count should equal in length");
    }

    const table = this.doc.table({
      widths: head.map((col) => col.width * pdf.mm),
      borderWidth: 0.5,
      borderColor: 0xdddddd,
    });

    // Table Head
    const headerRow = table.header({
      textAlign: "center",
      fontSize: 5,
      paddingTop: 5,
      paddingBottom: 5,
      color: 0xffffff,
      backgroundColor: 0x2f48be,
    });
    head.forEach((col) => {
      const { renderProps } = col;
      headerRow.cell(col.value, renderProps || {});
    });

    // Table Rows
    rows.forEach((rowData, idx) => {
      const { renderProps } = rowData || {};
      const isOdd = idx % 2 === 1;
      const backgroundColor = isOdd ? 0xfff7fa : 0xffffff;
      const row = table.row({
        backgroundColor,
        fontSize: 5,
        paddingTop: 1,
        paddingBottom: 1,
        textAlign: "center",
        ...renderProps,
      });

      rowData.columns.forEach((col) => {
        const { renderProps } = col;
        row.cell(col.value, renderProps || {});
      });
    });

    // Table Summary
    const summaryRow = table.row({
      textAlign: "center",
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 5,
      color: 0xffffff,
      backgroundColor: 0x2f48be,
    });
    summary.forEach((col) => {
      const { renderProps } = col;
      summaryRow.cell(col.value, renderProps || {});
    });

    // Allocations Row
    const allocationsRow = table.row({
      fontSize: 4,
      borderWidth: 0,
      borderColor: 0xffffff,
      textAlign: "center",
    });
    allocations.forEach((col) => {
      const { renderProps } = col;
      allocationsRow.cell(col.value, renderProps || {});
    });
  }

  generateFooter(data) {
    // put other details in a table
    const { managerName, name } = data.meta;
    const table = this.doc.table({
      widths: new Array(10).fill((PAGE_WIDTH - PAGE_PADDING * 2) / 10), // 10 cells of 2 cm
      borderWidth: 0,
      fontSize: 10,
    });

    // Row 1 Definition
    const row1 = table.row({
      paddingTop: 1 * pdf.cm,
      color: 0x444444,
    });

    const col1Props = {
      colspan: 8,
    };

    const col2Props = {
      colspan: 2,
    };

    // Row 1 Cells
    row1.cell("Approved by the manager", col1Props);

    row1.cell("Signed by employee", col2Props);

    // Row 2 Definition
    const row2 = table.row({
      paddingTop: 1.5 * pdf.cm,
      paddingBottom: 1 * pdf.cm,
      color: 0x444444,
    });

    // Row 2 Cells
    row2.cell(managerName, col1Props);

    row2.cell(name, col2Props);
  }

  toStream() {
    return new Promise((res, rej) => {
      const stream = new BlobStream();
      this.doc.pipe(stream);
      this.doc.end();

      stream.on("finish", () => {
        res(stream);
      });

      stream.on("error", (err) => {
        rej(err);
      });
    });
  }
}

export default PDF;
