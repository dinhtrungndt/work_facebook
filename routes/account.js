var express = require("express");
var router = express.Router();
const accountsModel = require("../models/accounts");
const FB = require("fb");

// Lấy danh sách các accounts
// http://localhost:3000/accounts
router.get("/", async (req, res) => {
  const data = await accountsModel.find();
  res.json(data);
});

// Lấy thông tin account theo id và token
// https://graph.facebook.com/USER-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/accounts/:id/:token
router.get("/:userId/:accessToken", async (req, res) => {
  const { userId, accessToken } = req.params;

  try {
    FB.api(
      `/${userId}?access_token=${accessToken}`,
      "GET",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy thông tin người dùng:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy thông tin người dùng thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
