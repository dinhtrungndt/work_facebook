// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// const clientKey = '6chomlvkst9ob';
// const clientSecret = 'c326a78a78936d90a56d6e5cda3b33de2a143135';
// const redirectUri = encodeURIComponent('https://datnapi-qelj.onrender.com');
// const { TiktokSDK } = require('tiktok-sdk');

// const tiktokInstance = new TiktokSDK('2173763362959066', 'f6ce4cf21fc62c82b7f1b3575fbd5d9f');
// router.get("/", (req, res) => {
//     res.send("Hello Tiktok");
// }
// );

// router.get('/auth', (req, res) => {
//     const state = '123456';
//     const authUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${clientKey}&response_type=code&scope=user.info.basic&redirect_uri=${redirectUri}&state=${state}`;
//     res.redirect(authUrl);
//     // tiktokInstance.auth.getAccessToken('authCode')
//     //     .then(
//     //         (res) => {
//     //             console.log(res);
//     //         }
//     //     )
//     // res.send("Hello Tiktok");
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

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cookieParser());
app.use(cors());
app.listen(process.env.PORT || 5000);

const CLIENT_KEY = 'aw3vkxd3dshunhj6' // this value can be found in app's developer portal
const SERVER_ENDPOINT_REDIRECT= encodeURIComponent('https://datnapi-qelj.onrender.com'); // this value can be found in app's developer portal
app.get('/oauth', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    let url = 'https://www.tiktok.com/v2/auth/authorize/';

    // the following params need to be in `application/x-www-form-urlencoded` format.
    url += '?client_key={CLIENT_KEY}';
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += '&redirect_uri={SERVER_ENDPOINT_REDIRECT}';
    url += '&state=' + csrfState;

    res.redirect(url);
})
module.exports = app;