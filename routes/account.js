const express = require("express");
const router = express.Router();
const axios = require('axios');
const accessToken = process.env.ACCESS_TOKEN;
const request = require('request-promise');  
const passport = require("passport");
const config = require("../config");
const FacebookStrategy = require("passport-facebook").Strategy;

const Bearertoken = ""

// Route để xử lý yêu cầu GET
router.get("/", async (req, res) => {
  try {
    const userId = '100009347046436'; // ID của người dùng trên Facebook
    const fields = 'id,name,posts{message}'; // Các trường dữ liệu cần lấy
    const apiUrl = `https://graph.facebook.com/${userId}?fields=${fields}&access_token=${accessToken}`;

    // Tạo headers với Bearer token
    const headers = {
      Authorization: `Bearer ${Bearertoken}`
    };

    // Sử dụng axios để gửi yêu cầu HTTP với headers
    const response = await axios.get(apiUrl, { headers });
    res.json(response.data);
  } catch (error) {
   // console.error("Lỗi:", error);
    res.status(500).json({ error: "Network too fast" });
  }
});

module.exports = router;
