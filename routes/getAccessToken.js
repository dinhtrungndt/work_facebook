const axios = require("axios");

const appId = "453934460546244";
const appSecret = "f533b5582d1a5b3fbc90a10c80fb5b07";

const getAccessToken = async () => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`
    );
    const accessToken = response.data.access_token;
    // console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error getting Access Token:", error);
    throw error;
  }
};

module.exports = getAccessToken;
