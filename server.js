require("dotenv").config();

const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const port = Number(process.env.PORT || 4173);
const archiveShapeIsValid = (value) => value && ["buyers", "samples", "locations", "movements"].every((key) => Array.isArray(value[key]));

let archiveCollection;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

app.get("/api/archive", async (_request, response) => {
  if (!archiveCollection) return response.status(503).json({ error: "Atlas is not connected yet." });

  try {
    const document = await archiveCollection.findOne({ _id: "main" });
    response.json(document?.data || null);
  } catch (_error) {
    response.status(500).json({ error: "Unable to read the archive." });
  }
});

app.put("/api/archive", async (request, response) => {
  if (!archiveCollection) return response.status(503).json({ error: "Atlas is not connected yet." });
  if (!archiveShapeIsValid(request.body)) return response.status(400).json({ error: "Invalid archive data." });

  try {
    await archiveCollection.updateOne(
      { _id: "main" },
      { $set: { data: request.body, updatedAt: new Date() } },
      { upsert: true }
    );
    response.status(204).end();
  } catch (_error) {
    response.status(500).json({ error: "Unable to save the archive." });
  }
});

async function start() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    archiveCollection = client.db(process.env.MONGODB_DB || "sample_archive").collection("archives");
    console.log("MongoDB Atlas connected.");
  } catch (_error) {
    console.error("MongoDB Atlas connection failed. The app will remain in local-only mode.");
  }

  app.listen(port, () => console.log(`Sample Archive is running on http://127.0.0.1:${port}`));
}

start();
