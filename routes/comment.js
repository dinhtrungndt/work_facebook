var express = require("express");
var router = express.Router();
const axios = require("axios");

// Lấy danh sách comment bài viết dự theo api https://graph.facebook.com/USER-ID?access_token=ACCESS-TOKEN
// với USER-ID là id của người dùng, ACCESS-TOKEN là token của người dùng trong body để nhập
router.get("/get-comment-posts/:idUser/:accessToken", async (req, res) => {
  try {
    const { idUser, accessToken } = req.query;
     //const idUser = '100009347046436'
     //const accessToken = 'EAAGNO4a7r2wBOyZAP4ZBk1BkoUhfud3dIyc70GZCZBDEzEnn3EbFI3BymaTLdJZAEmrLqHBiuM1xZA6vLmDNCnhoE1rHEPYUJpaufZCAruSAZAswgQujqxPb3AofvjwKrUVi6ZCi4A28RZCmU0PDa3cdc8Lx4SEohdSo78oZBulyPKuemiIxMJfjM3IfwPJowZDZD'
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
