const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

// Thông tin ứng dụng TikTok
const clientKey = 'aw3vkxd3dshunhj6';
const clientSecret = '27bRu8tY2x4on32nL03A4zEqkQjrmlp0';
const redirectUri = 'http://localhost:3000/callback';

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Định tuyến cho trang chủ
router.get('/', (req, res) => {
  const state = generateRandomString(16);
  const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${clientKey}&scope=user.info.basic&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
  res.redirect(authUrl);
});

// Định tuyến cho callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  // Kiểm tra giá trị state
  if (state !== generateRandomString(16)) {
    return res.status(400).send('Invalid state');
  }

  try {
    // Trao đổi mã xác thực để lấy mã truy cập
    const tokenResponse = await axios.post(
      'https://open-api.tiktok.com/oauth/access_token/',
      querystring.stringify({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.data.access_token;

    // Lấy thông tin cơ bản của người dùng
    const userResponse = await axios.get('https://open.tiktok.com/user/info/basic/', {
      headers: {
        'Access-Token': accessToken,
      },
    });

    const userInfo = userResponse.data.data;

    res.send(`Welcome, ${userInfo.unique_id}!`);
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(500).send('Error authenticating with TikTok');
  }
});

module.exports = router;