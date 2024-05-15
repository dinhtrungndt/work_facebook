var express = require("express");
var router = express.Router();
const axios = require("axios");
const commentsModel = require("../models/comments");
const getAccessToken = require("./getAccessToken");
const passport = require("../app");

// console.log("passport:", passport);
getAccessToken()
  .then((accessToken) => {
    // Lấy danh sách các comments
    // http://localhost:3000/comments
    router.get("/", async (req, res) => {
      const data = await commentsModel.find();
      res.json(data);
    });

    // Lấy danh sách comments trên facebook
    // http://localhost:3000/comments/get-comments-facebook/:idPost
    router.get("/get-comments-facebook/:idPost", async (req, res) => {
      try {
        const { idPost } = req.params;
        // const accessTokenT =
        // "EAAGNO4a7r2wBO8EIPzj6bixHytYPUzOFxgZCzhUW1ZBiPxXWKwPwGDi7g5DV7Dd0uZB6BgUypJxefFaUNBJpmNgJcB0onMdj7SDGYDZBUwmRLNzfIuq1a7paDQXZBOZAolRJ6gknZBHjsrMyedgFQZBORGV8mzcC86D276f9xsoRMU56q3cQFzhGs6kVY5guw6dJcZBLvRNKmgwZDZD";
        const url = `https://graph.facebook.com/${idPost}/comments?access_token=${accessToken}`;
        const response = await axios.get(url);
        if (response.data.error) {
          console.log(
            "Lỗi lấy danh sách comments trên facebook ",
            response.data.error
          );
          return res.status(400).json(response.data.error);
        }

        console.log("Lấy danh sách comments trên facebook thành công ");
        res.json(response.data);
      } catch (error) {
        console.log("Lỗi lấy danh sách comments trên facebook ", error);
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
  })
  .catch((error) => {
    console.error("Error getting Access Token:", error);
  });

module.exports = router;
