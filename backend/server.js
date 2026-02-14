const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, "accounts.json");

app.use(cors());
app.use(express.json());

function readAccounts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeAccounts(accounts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(accounts, null, 2));
}

app.get("/accounts", (req, res) => {
  res.json(readAccounts());
});

app.post("/accounts", (req, res) => {
  const { platform, name, email } = req.body;

  if (!platform?.trim() || !name?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ message: "All fields are required and cannot be empty" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const accounts = readAccounts();

  const isDuplicate = accounts.some(
    (acc) =>
      acc.platform.toLowerCase() === platform.toLowerCase() &&
      acc.email.toLowerCase() === email.toLowerCase(),
  );

  if (isDuplicate) {
    return res
      .status(409)
      .json({ message: "This account already exists on this platform" });
  }

  const newAccount = {
    id: Date.now().toString(),
    platform: platform.trim(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    status: "Active",
  };

  accounts.push(newAccount);
  writeAccounts(accounts);

  res.status(201).json(newAccount);
});

app.put("/accounts/:id", (req, res) => {
  const accounts = readAccounts();
  const index = accounts.findIndex((a) => a.id === req.params.id);

  if (index === -1) return res.sendStatus(404);

  accounts[index] = { ...accounts[index], ...req.body };
  writeAccounts(accounts);
  res.json(accounts[index]);
});

app.delete("/accounts/:id", (req, res) => {
  const accounts = readAccounts().filter((a) => a.id !== req.params.id);
  writeAccounts(accounts);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
