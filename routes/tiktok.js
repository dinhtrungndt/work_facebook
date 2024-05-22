const express = require("express");
const axios = require("axios");
const router = express.Router();
const clientKey = 'aw3vkxd3dshunhj6';
const clientSecret = '27bRu8tY2x4on32nL03A4zEqkQjrmlp0';
const redirectUri = encodeURIComponent('http://localhost:3000/callback');

router.get("/", (req, res) => {
  res.send("Hello Tiktok");
});

router.get('/auth', (req, res) => {
  const state = Math.random().toString(36).substring(2); // Tạo giá trị state ngẫu nhiên
  req.session.state = state; // Lưu giá trị state vào session
  const authUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${clientKey}&response_type=code&scope=user.info.basic&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Kiểm tra giá trị state để ngăn chặn tấn công CSRF
  if (!req.session.state || req.session.state !== state) {
    return res.status(400).send('Invalid state');
  }

  try {
    const tokenResponse = await axios.post('https://open-api.tiktok.com/oauth/access_token', null, {
      params: {
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: decodeURIComponent(redirectUri),
      },
    });

    // Kiểm tra trạng thái xác thực
    if (tokenResponse.data.data.error) {
      const { error, error_description } = tokenResponse.data.data;
      return res.status(400).send(`Error getting access token: ${error} - ${error_description}`);
    }

    const accessToken = tokenResponse.data.data.access_token;
    res.send(`Access Token: ${accessToken}`);
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    res.status(500).send('Error getting access token');
  }
});

module.exports = router;