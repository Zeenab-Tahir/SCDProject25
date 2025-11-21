const connectDB = require("./db/mongo");
connectDB();

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const db = require("./db");
require("./events/logger");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
=====================
  `);

  rl.question("Choose option: ", async (ans) => {
    switch (ans.trim()) {

      // ADD
      case "1":
        rl.question("Enter name: ", (name) => {
          rl.question("Enter value: ", async (value) => {
            await db.addRecord({ name, value });
            console.log("Record added successfully!");
            menu();
          });
        });
        break;

      // LIST
      case "2":
        const records = await db.listRecords();
        if (records.length === 0) console.log("No records found.");
        else
          records.forEach((r) =>
            console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value || "N/A"}`)
          );

        menu();
        break;

      // UPDATE
      case "3":
        rl.question("Enter record ID to update: ", (id) => {
          rl.question("New name: ", (name) => {
            rl.question("New value: ", async (value) => {
              const updated = await db.updateRecord(Number(id), name, value);
              console.log(updated ? "Record updated!" : "Record not found.");
              menu();
            });
          });
        });
        break;

      // DELETE
      case "4":
        rl.question("Enter record ID to delete: ", async (id) => {
          const deleted = await db.deleteRecord(Number(id));
          console.log(deleted ? "Record deleted!" : "Record not found.");
          menu();
        });
        break;

      // SEARCH
      case "5":
        rl.question("Enter search keyword: ", async (term) => {
          const res = await db.searchRecords(term);
          if (res.length === 0) console.log("No matching records found.");
          else {
            console.log(`Found ${res.length} matching records:`);
            res.forEach((r) =>
              console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`)
            );
          }
          menu();
        });
        break;

      // SORT
      case "6":
        rl.question("Sort by (name/created/id): ", (sortBy) => {
          rl.question("Order (asc/desc): ", async (order) => {
            const sorted = await db.sortRecords(sortBy, order);

            console.log("\nSorted Records:\n");
            sorted.forEach((r) =>
              console.log(`ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`)
            );

            menu();
          });
        });
        break;

      // EXPORT
      case "7":
        const filePath = await db.exportToTxt();
        console.log(`Data exported successfully → ${filePath}`);
        menu();
        break;

      // STATISTICS
      case "8":
        const stats = await db.viewStats();
        if (!stats) {
          console.log("No data available.");
          return menu();
        }

        console.log(`
Vault Statistics:
--------------------------
Total Records: ${stats.total}
Last Modified: ${stats.lastModified}
Longest Name: ${stats.longestName} (${stats.longestLen} characters)
Earliest Record: ${stats.earliest}
Latest Record: ${stats.latest}
`);
        menu();
        break;

      // EXIT
      case "9":
        console.log("Exiting NodeVault...");
        rl.close();
        break;

      default:
        console.log("Invalid option. Try again.");
        menu();
    }
  });
}

menu();

