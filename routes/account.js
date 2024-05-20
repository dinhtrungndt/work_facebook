var express = require("express");
var router = express.Router();
const accountsModel = require("../models/accounts");
const FB = require("fb");

// router.get("/", async (req, res) => {
//   try {
//     const data = await accountsModel.find();
//     res.json(data);
//     console.log(data);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
  
//   }
// });

// module.exports = router;
require('dotenv').config();
const axios = require('axios');
const accessToken = process.env.ACCESS_TOKEN;
var graph = require('fbgraph');
// console.log(accessToken);
graph.setAccessToken(accessToken);
// Route để xử lý yêu cầu GET
const userId = '100009347046436';
router.get("/", async (req, res) => {
  console.log(`https://graph.facebook.com/me?fields=id,name,posts{message}&access_token=${accessToken}`);
  try {
    console.log('1')
        
    //const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,posts{message}&access_token=${accessToken}`);
    console.log('2')
    console.log(`https://graph.facebook.com/me?fields=id,name,posts{message}&access_token=${accessToken}`);
    //res.json(response.data);
} catch (error) {
  console.error("Error:", error);
    res.status(500).send(error.toString());
}
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
