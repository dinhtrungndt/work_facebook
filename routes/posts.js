var express = require("express");
var router = express.Router();
const postsModel = require("../models/posts");
const FB = require("fb");

// Lấy danh sách các posts
// http://localhost:3000/posts
router.get("/", async (req, res) => {
  const data = await postsModel.find();
  res.json(data);
});

// Lấy danh sách page của cá nhân trên facebook
// https://graph.facebook.com/USER-ID/accounts?access_token=ACCESS_TOKEN
// http://localhost:3000/posts/getAll-posts-accounts/:idUser/:accessToken
router.get("/getAll-posts-accounts/:idUser/:accessToken", async (req, res) => {
  const { idUser, accessToken } = req.params;

  try {
    FB.api(
      `/${idUser}/accounts?access_token=${accessToken}`,
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

// Lấy bài viết chi tiết của page
// https://graph.facebook.com/PAGE-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/posts/get-posts/:pageId/:accessToken
router.get("/get-posts/:pageId/:accessToken", async (req, res) => {
  const { pageId, accessToken } = req.params;

  try {
    FB.api(
      `/${pageId}?access_token=${accessToken}`,
      "GET",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy thông tin người dùng:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy bài viết thành công :", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
