// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// const clientKey = '6chomlvkst9ob';
// const clientSecret = 'c326a78a78936d90a56d6e5cda3b33de2a143135';
// const redirectUri = encodeURIComponent('http://localhost:3000/callback');
// const { TiktokSDK } = require('tiktok-sdk');

// const tiktokInstance = new TiktokSDK('2173763362959066', 'f6ce4cf21fc62c82b7f1b3575fbd5d9f');
// router.get("/", (req, res) => {
//     res.send("Hello Tiktok");
// }
// );

// router.get('/auth', (req, res) => {
//     // const authUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${clientKey}&response_type=code&scope=user.info.basic&redirect_uri=${redirectUri}&state=your_state`;
//     // res.redirect(authUrl);
//     // tiktokInstance.auth.getAccessToken('authCode')
//     //     .then(
//     //         (res) => {
//     //             console.log(res);
//     //         }
//     //     )
//     res.send("Hello Tiktok");
// });

// router.get('/callback', async (req, res) => {
//     const { code } = req.query;

//     try {
//         const tokenResponse = await axios.post('https://open-api.tiktok.com/oauth/access_token', null, {
//             params: {
//                 client_key: clientKey,
//                 client_secret: clientSecret,
//                 code: code,
//                 grant_type: 'authorization_code',
//                 redirect_uri: decodeURIComponent(redirectUri),
//             },
//         });

//         const accessToken = tokenResponse.data.data.access_token;
//         res.send(`Access Token: ${accessToken}`);
//     } catch (error) {
//         console.error('Error getting access token:', error.response ? error.response.data : error.message);
//         res.status(500).send('Error getting access token');
//     }
// });

// module.exports = router;
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');

const router = express.Router();

// Step 1: Redirect to TikTok for authentication
router.get('/tiktok', (req, res) => {
    const authUrl = `https://open-api.tiktok.com/platform/oauth/connect?client_key=${process.env.TIKTOK_CLIENT_KEY}&response_type=code&scope=user.info.basic&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}&state=some_random_string`;
    res.redirect(authUrl);
});

// Step 2: Handle TikTok's callback and exchange code for access token
router.get('/tiktok/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post('https://open-api.tiktok.com/oauth/access_token/', qs.stringify({
            client_key: process.env.TIKTOK_CLIENT_KEY,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.TIKTOK_REDIRECT_URI,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenResponse.data.data.access_token;

        // Step 3: Fetch user info
        const userInfoResponse = await axios.get(`https://open-api.tiktok.com/user/info/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const userInfo = userInfoResponse.data.data;

        res.json({
            message: 'User authenticated successfully!',
            user: userInfo,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

