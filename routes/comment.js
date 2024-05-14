var express = require("express");
var router = express.Router();
const axios = require("axios");
const commentsModel = require("../models/comments");

// Lấy danh sách các comments
// http://localhost:3000/comments
router.get("/", async (req, res) => {
  const data = await commentsModel.find();
  res.json(data);
});

// Lấy danh sách comments trên facebook
// http://localhost:3000/comments/get-comments-facebook/:idPost/:token
// https://graph.facebook.com/ID-POSTS/comments?access_token=TOKEN
router.get("/get-comments-facebook/:idPost/:token", async (req, res) => {
  try {
    const { idPost, token } = req.params;
    const url = `https://graph.facebook.com/${idPost}/comments?access_token=${token}`;
    const data = await axios.get(url);
    console.log("Lấy danh sách comments trên facebook thành công ", data);
    res.json(data.data);
  } catch (error) {
    console.log("Lỗi lấy danh sách comments trên facebook ", error);
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

module.exports = router;
