var express = require("express");
var router = express.Router();
const accountsModel = require("../models/accounts");

// Lấy danh sách các accounts
// http://localhost:3000/accounts
router.get("/", async (req, res) => {
  const data = await accountsModel.find();
  res.json(data);
});

module.exports = router;
