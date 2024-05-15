var express = require("express");
var router = express.Router();
const axios = require("axios");

require("dotenv").config();

const accessToken = process.env.ACCESS_TOKEN;
const pageId = process.env.PAGE_ID;

router.get("/fetch-page-data", async (req, res) => {
  try {
    // Thay 'posts' bằng 'feed' nếu bạn muốn lấy feed thay vì bài viết do trang đăng
    // https://graph.facebook.com/100015115748911/accounts?access_token=
    const response = await axios.get(
      `https://graph.facebook.com/${pageId}/accounts?access_token=${accessToken}`
    );
    console.log("response.data:", response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).send("Failed to fetch data");
  }
});

module.exports = router;
