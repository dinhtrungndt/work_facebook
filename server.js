require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
const PORT = 3000;

// Step 1: Redirect to TikTok for authentication
app.get('/auth/tiktok', (req, res) => {
    const authUrl = `https://open-api.tiktok.com/platform/oauth/connect?client_key=${process.env.TIKTOK_CLIENT_KEY}&response_type=code&scope=user.info.basic&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}&state=some_random_string`;
    res.redirect(authUrl);
});

// Step 2: Handle TikTok's callback and exchange code for access token
app.get('/auth/tiktok/callback', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
