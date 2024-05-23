var express = require("express");
var router = express.Router();
const accountsModel = require("../models/accounts");
const FB = require("fb");

// Lấy danh sách các accounts
// http://localhost:3000/accounts
router.get("/", async (req, res) => {
  const data = await accountsModel.find();
  res.json(data);
});

// Lấy thông tin account theo id và token
// https://graph.facebook.com/USER-ID?access_token=ACCESS-TOKEN
// http://localhost:3000/accounts/:id/:token
router.get("/:userId/:accessToken", async (req, res) => {
  const { userId, accessToken } = req.params;

  try {
    FB.api(
      `/${userId}?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,name,email,picture.height(1000).width(1000),link,accounts,groups,likes,location,gender,birthday",
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

// Lấy danh sách bài viết của account theo id và token
// https://graph.facebook.com/USER-ID/posts?access_token=ACCESS-TOKEN
// http://localhost:3000/accounts/get-posts-all/:id/:token
router.get("/get-posts-all/:userId/:accessToken", async (req, res) => {
  const { userId, accessToken } = req.params;

  try {
    FB.api(
      `/${userId}/posts?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,message,created_time,full_picture,permalink_url, message_tags, comments,privacy",
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

// Lấy danh sách bình luận của bài viết theo id và token
// https://graph.facebook.com/POST-ID/comments?access_token=ACCESS-TOKEN
// http://localhost:3000/accounts/get-comments/:postId/:accessToken
router.get("/get-comments/:postId/:accessToken", async (req, res) => {
  const { postId, accessToken } = req.params;

  try {
    FB.api(
      `/${postId}/comments?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,from,message,created_time,comments",
      },
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy danh sách bình luận:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy danh sách bình luận thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách bạn bè của account theo id và token
// https://graph.facebook.com/USER-ID/friends?access_token=ACCESS-TOKEN
// http://localhost:3000/accounts/get-friends/:id/:token
router.get("/get-friends/:userId/:accessToken", async (req, res) => {
  const { userId, accessToken } = req.params;

  try {
    FB.api(
      `/${userId}/friends?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,name,picture.height(1000).width(1000),link,total_count",
      },
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy danh sách bạn bè:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy danh sách bạn bè thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
})

// Lấy danh sách nhóm của account theo id và token
// https://graph.facebook.com/USER-ID/groups?access_token=ACCESS-TOKEN
// http://localhost:3000/accounts/get-groups/:id/:token
router.get("/get-groups/:userId/:accessToken", async (req, res) => {
  const { userId, accessToken } = req.params;

  try {
    FB.api(
      `/${userId}/groups?access_token=${accessToken}`,
      "GET",
      {
        fields: "id,name,privacy,description,icon,cover,member_count",
      },
      function (response) {
        if (!response || response.error) {
          console.error("Lỗi khi lấy danh sách nhóm:", response.error);
          return res.status(500).json(response.error);
        }

        // console.log("Lấy danh sách nhóm thành công:", response);
        res.json(response);
      }
    );
  } catch (error) {
    console.error("Lỗi khi gọi Facebook API:", error);
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
