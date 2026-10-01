require("dotenv").config();

const express = require("express");
const path = require("path");
const archiveHandler = require("./api/archive");

const app = express();
const port = Number(process.env.PORT || 4173);

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

app.all("/api/archive", (req, res) => archiveHandler(req, res));

if (require.main === module) {
  app.listen(port, () => console.log(`Sample Archive is running on http://127.0.0.1:${port}`));
}

module.exports = app;
