var express = require("express");
var router = express.Router();
const axios = require("axios");

// Lấy danh sách comment bài viết dự theo api https://graph.facebook.com/USER-ID?access_token=ACCESS-TOKEN
// với USER-ID là id của người dùng, ACCESS-TOKEN là token của người dùng trong body để nhập
router.get("/get-comment-posts/:idUser/:accessToken", async (req, res) => {
  try {
    const { idUser, accessToken } = req.query;
    // const idUser = 'pfbid02iKrsVUWrAPZ6VUHC2zH7F7dNBrbwrXAkHPbkgx4yPpXuw9CoghpbXJRMw4woGWQ4l'
    // const accessToken = 'EAAGNO4a7r2wBO3lx5i3AHkZAVg1MAyI6TekC0ODJZCZASsy5Ms5unTBzHoedForIAu4arAQRDB6LAQYuAm8Cn7acwX15fioZBnkn63UUySbdWLHvTfM90DILmZCFEOVfCSAURejA1FLIMO6OouMs2QEk878Txg5nQktR5OhyembGxwQveyTaVTuoa7kk3jXREe2a6TpCLHAZDZD'
    const response = await axios.get(
      `https://graph.facebook.com/${idUser}?access_token=${accessToken}`
    );
    res.json(response);
    console.log("get-comment-posts", response);
  } catch (error) {
    console.log("get-comment-posts", error);
    res.json(error);
  }
});

module.exports = router;
