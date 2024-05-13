var express = require("express");
var router = express.Router();
const FB = require("fb");

/* GET home page. */
router.get("/", function (req, res, next) {
  
  res.render("index", { title: "Work - Facebook --" });
});

FB.api(
  "/pfbid02pwWv9vBKCo9Jwo6B4E6rmjZeRmFjtqJjKyNMQmGx8wSXJE5r75AbHQmH5S4E9Y91l",
  "POST",
  {
    "message": "This is a test comment"
  },
  function (response) {
    if (response && !response.error) {
      console.log("Post was successful! Post ID: " + response);
    }
  }
);
module.exports = router;
