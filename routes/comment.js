var express = require("express");
var router = express.Router();
const axios = require("axios");
const commentsModel = require("../models/comments");
const ReplyCommentModel = require("../models/replyComments");
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

        // console.log("Lấy bài viết thành công :", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Bình luận bài viết dựa vào post-id
// https://graph.facebook.com/POST-ID/comments?message=MESSAGE&access_token=ACCESS-TOKEN
// http://localhost:3000/comments/comment-posts/:postId/:accessToken
router.post("/comment-posts/:postId/:accessToken", async (req, res) => {
  const { postId, accessToken } = req.params;
  const { message } = req.body;

  try {
    FB.api(
      `/${postId}/comments?message=${message}&access_token=${accessToken}`,
      "POST",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi bình luận bài viết:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Bình luận bài viết thành công:", response);

        // Lưu vào database
        const newComment = new commentsModel({
          idComment: response.id,
          message: message,
        });
        newComment.save();
        // console.log("newCommentnewComment:", newComment);

        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cập nhập bình luận dựa vào comment-id
// https://graph.facebook.com/COMMENT-ID?message=MESSAGE&access_token=ACCESS-TOKEN
// http://localhost:3000/comments/update-comments/:commentId/:accessToken
router.put("/update-comments/:commentId/:accessToken", async (req, res) => {
  const { commentId, accessToken } = req.params;
  const { message } = req.body;

  try {
    FB.api(
      `/${commentId}?message=${message}&access_token=${accessToken}`,
      "POST",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi cập nhập bình luận:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Cập nhập bình luận thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Xóa bình luận dựa vào comment-id
// https://graph.facebook.com/COMMENT-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/comments/delete-comments/:commentId/:accessToken
router.delete("/delete-comments/:commentId/:accessToken", async (req, res) => {
  const { commentId, accessToken } = req.params;

  try {
    FB.api(
      `/${commentId}?access_token=${accessToken}`,
      "DELETE",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi xóa bình luận:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Xóa bình luận thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Phản hồi bình luận của bình luận dựa vào comment-id
// https://graph.facebook.com/COMMENT-ID/comments?message=MESSAGE&access_token=ACCESS-TOKEN
// http://localhost:3000/comments/reply-comments/:commentId/:accessToken
router.post("/reply-comments/:commentId/:accessToken", async (req, res) => {
  const { commentId, accessToken } = req.params;
  const { message } = req.body;

  try {
    FB.api(
      `/${commentId}/comments?message=${message}&access_token=${accessToken}`,
      "POST",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi phản hồi bình luận:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Phản hồi bình luận thành công:", response);

        // Lưu vào database
        const newReplyComment = new ReplyCommentModel({
          idReply: response.id,
          message: message,
        });
        newReplyComment.save();
        // console.log("newReplyCommentnewReplyComment:", newReplyComment);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
