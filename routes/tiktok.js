const express = require("express");
const axios = require("axios");
const router = express.Router();

const clientKey = '6chomlvkst9ob';
const clientSecret = 'c326a78a78936d90a56d6e5cda3b33de2a143135';
const redirectUri = encodeURIComponent('http://localhost:3000/callback');

router.get("/", (req, res) => {
    res.send("Hello Tiktok");
}
);

router.get('/auth', (req, res) => {
    const authUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${clientKey}&response_type=code&scope=user.info.basic&redirect_uri=${redirectUri}&state=your_state`;
    res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;

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

        const accessToken = tokenResponse.data.data.access_token;
        res.send(`Access Token: ${accessToken}`);
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).send('Error getting access token');
    }
});

module.exports = router;

