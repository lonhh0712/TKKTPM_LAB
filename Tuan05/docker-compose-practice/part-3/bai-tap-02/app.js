const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/mydb";

mongoose.connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo connection error:", err.message));

const itemSchema = new mongoose.Schema({ name: String }, { timestamps: true });
const Item = mongoose.model("Item", itemSchema);

app.post("/items", async (req, res) => {
  const item = await Item.create({ name: req.body.name || "default" });
  res.status(201).json(item);
});

app.get("/items", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

app.get("/", (req, res) => {
  res.send("Node.js + MongoDB is running");
});

app.listen(3000, () => console.log("API listening on 3000"));
