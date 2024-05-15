var express = require("express");
var router = express.Router();
const getAccessToken = require("./getAccessToken");
const axios = require("axios");

getAccessToken()
  .then((accessToken) => {
    console.log("Access Token: in Index ", accessToken);
    router.get("/", async function (req, res) {
      try {
        const idUser = "100015115748911";
        const url = `https://graph.facebook.com/${idUser}?access_token=${accessToken}`;
        // console.log("urlurlurlurlurlurl:", url);

        const response = await axios.get(url);
        const { name, id } = response.data;

        console.log("User Info:", { name, id });

        res.render("index", {
          user: req.user,
          name,
          id,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Error fetching user data");
      }
    });
  })
  .catch((error) => {
    console.error("Error getting Access Token:", error);
  });

// FB.api(
//   "/pfbid02pwWv9vBKCo9Jwo6B4E6rmjZeRmFjtqJjKyNMQmGx8wSXJE5r75AbHQmH5S4E9Y91l",
//   "POST",
//   {
//     "message": "This is a test comment"
//   },
//   function (response) {
//     if (response && !response.error) {
//       console.log("Post was successful! Post ID: " + response);
//     }
//   }
// );
module.exports = router;
