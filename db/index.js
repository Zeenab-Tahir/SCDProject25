const Record = require("./recordModel");

// ADD RECORD
async function addRecord({ name, value }) {
  const rec = await Record.create({
    id: Date.now(),
    name,
    value,
    created: new Date().toISOString().split("T")[0]
  });
  return rec;
}

// LIST RECORDS
async function listRecords() {
  return await Record.find({});
}

// UPDATE RECORD
async function updateRecord(id, newName, newValue) {
  return await Record.findOneAndUpdate(
    { id },
    { name: newName, value: newValue },
    { new: true }
  );
}

// DELETE RECORD
async function deleteRecord(id) {
  return await Record.findOneAndDelete({ id });
}


// SAFE SEARCH (works for both ID and name)
async function searchRecords(term) {
  const t = String(term).trim();

  // If numeric → search by ID
  if (!isNaN(t)) {
    return await Record.find({ id: Number(t) });
  }

  // Otherwise search by name only
  return await Record.find({
    name: { $regex: t, $options: "i" }
  });
}


// SORT
async function sortRecords(by = "name", order = "asc") {
  const sortOrder = order === "asc" ? 1 : -1;

  const sortObj = {};
  sortObj[by] = sortOrder;

  return await Record.find().sort(sortObj);
}


// EXPORT TO TXT
const fs = require("fs");
const path = require("path");

async function exportToTxt() {
  const all = await Record.find({});

  const header =
    `Export File: export.txt\n` +
    `Date: ${new Date().toLocaleString()}\n` +
    `Total Records: ${all.length}\n\n`;

  const body = all
    .map(
      (r, i) =>
        `${i + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`
    )
    .join("\n");

  const output = header + body + "\n";

  const exportPath = path.join(__dirname, "..", "export.txt");
  fs.writeFileSync(exportPath, output, "utf8");

  return exportPath;
}

// VIEW STATISTICS
async function viewStats() {
  const all = await Record.find({});
  if (all.length === 0) return null;

  const total = all.length;

  const longest = all.reduce(
    (a, b) => ((b.name || "").length > (a.name || "").length ? b : a),
    { name: "" }
  );

  const dates = all.map((r) => new Date(r.created));
  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));

  let lastModified = latest.toLocaleString();

  return {
    total,
    lastModified,
    longestName: longest.name,
    longestLen: longest.name.length,
    earliest: earliest.toISOString().split("T")[0],
    latest: latest.toISOString().split("T")[0]
  };
}

module.exports = {
  addRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  searchRecords,
  sortRecords,
  exportToTxt,
  viewStats
};

