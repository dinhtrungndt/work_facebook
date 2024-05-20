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
      {
        fields: "id,name,access_token,category,link,phone",
      },
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
      {
        fields:
          "id,name,about,category,cover,fan_count,link,location,phone, picture",
      },
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy thông tin người dùng:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy bài viết thành công :", response);
        res.json([response]);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết một bài viết
// https://graph.facebook.com/POST-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/posts/get-posts-detail/:postId/:accessToken
router.get("/get-posts-detail/:postId/:accessToken", async (req, res) => {
  const { postId, accessToken } = req.params;

  try {
    FB.api(
      `/${postId}?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,message,created_time,full_picture,permalink_url",
      },
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy thông tin bài viết:", response);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy thông tin bài viết thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Đăng bài viết page
// https://graph.facebook.com/PAGE-ID/feed?message=MESSAGE&access_token=ACCESS-TOKEN
// http://localhost:3000/posts/post-posts/:pageId/:accessToken
router.post("/post-posts/:pageId/:accessToken", async (req, res) => {
  const { pageId, accessToken } = req.params;
  const { message, link } = req.body;

  try {
    let postData = { message };
    if (link) {
      postData.link = link;
    }

    FB.api(
      `/${pageId}/feed?access_token=${accessToken}`,
      "POST",
      postData,
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi đăng bài viết:", response.error);
          return res.status(500).json(response.error);
        }

        // Lưu vào database
        const newPost = new postsModel({
          idPost: response.id,
          message: message,
          link: link || "",
        });
        newPost.save();

        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật bài viết page
// https://graph.facebook.com/POST-ID?message=MESSAGE&access_token=ACCESS-TOKEN
// http://localhost:3000/posts/update-posts/:postId/:accessToken
router.put("/update-posts/:postId/:accessToken", async (req, res) => {
  const { postId, accessToken } = req.params;
  const { message } = req.body;

  try {
    FB.api(
      `/${postId}?message=${message}&access_token=${accessToken}`,
      "POST",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi cập nhật bài viết:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Cập nhật bài viết thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Xóa bài viết page
// https://graph.facebook.com/POST-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/posts/delete-posts/:postId/:accessToken
router.delete("/delete-posts/:postId/:accessToken", async (req, res) => {
  const { postId, accessToken } = req.params;

  try {
    FB.api(
      `/${postId}?access_token=${accessToken}`,
      "DELETE",
      {},
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi xóa bài viết:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Xóa bài viết thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách bài viết của page
// https://graph.facebook.com/PAGE-ID/feed?access_token=ACCESS-TOKEN
// http://localhost:3000/posts/get-posts-all/:pageId/:accessToken
router.get("/get-posts-all/:pageId/:accessToken", async (req, res) => {
  const { pageId, accessToken } = req.params;

  try {
    FB.api(
      `/${pageId}/feed?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,message,created_time,full_picture,permalink_url, story",
      },
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy danh sách bài viết:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy danh sách bài viết thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết page của người dùng khác trên facebook
// https://graph.facebook.com/USER-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/posts/get-posts-detail-user/:userId/:accessToken
router.get("/get-posts-detail-user/:userId/:accessToken", async (req, res) => {
  const { userId, accessToken } = req.params;

  try {
    FB.api(
      `/${userId}?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,name,email,picture,link,accounts,permissions",
      },
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
