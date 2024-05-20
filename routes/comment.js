var express = require("express");
var router = express.Router();
const axios = require("axios");
const commentsModel = require("../models/comments");
const getAccessToken = require("./getAccessToken");
const FB = require("fb");

// console.log("passport:", passport);
// getAccessToken()
//   .then((accessToken) => {
// Lấy danh sách các comments
// http://localhost:3000/comments
router.get("/", async (req, res) => {
  const data = await commentsModel.find();
  res.json(data);
});

// Lấy danh sách comments trên facebook
// http://localhost:3000/comments/get-comments-facebook/:pageId/:accessToken
router.get("/get-comments-facebook/:pageId/:accessToken", async (req, res) => {
  const { pageId, accessToken } = req.params;

  try {
    FB.api(
      `/${pageId}/comments?access_token=${accessToken}`,
      "GET",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy thông tin người dùng:", response.error);
          return res.status(500).json(response.error);
        }

        console.log("Lấy bài viết thành công :", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Thêm danh sách comment
// http://localhost:3000/comments/add-comment
router.post("/add-comment", async (req, res) => {
  try {
    const data = req.body;
    const comment = new commentsModel(data);
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.log("Lỗi thêm danh sách comments ", error);
  }
});
// })
// .catch((error) => {
//   console.error("Error getting Access Token:", error);
// });

module.exports = router;
