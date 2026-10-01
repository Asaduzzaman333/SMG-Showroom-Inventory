const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function getArchiveCollection() {
  if (cachedDb) {
    return cachedDb.collection("archives");
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured in environment variables.");
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(process.env.MONGODB_DB || "sample_archive");
  return cachedDb.collection("archives");
}

const archiveShapeIsValid = (value) =>
  value &&
  ["buyers", "samples", "locations", "movements"].every((key) =>
    Array.isArray(value[key])
  );

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    try {
      const collection = await getArchiveCollection();
      const document = await collection.findOne({ _id: "main" });
      return res.status(200).json(document?.data || null);
    } catch (error) {
      console.error("GET /api/archive error:", error);
      return res.status(503).json({ error: error.message || "Unable to read the archive." });
    }
  }

  if (req.method === "PUT") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON format." });
      }
    }

    if (!archiveShapeIsValid(body)) {
      return res.status(400).json({ error: "Invalid archive data." });
    }

    try {
      const collection = await getArchiveCollection();
      await collection.updateOne(
        { _id: "main" },
        { $set: { data: body, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(204).end();
    } catch (error) {
      console.error("PUT /api/archive error:", error);
      return res.status(500).json({ error: error.message || "Unable to save the archive." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
