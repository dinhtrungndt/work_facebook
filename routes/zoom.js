const express = require("express");
const config = require("../config");
const router = express.Router();
const jwt = require("jsonwebtoken");
const payload = {
  iss: config.development.APIKey,
  exp: (new Date()).getTime() + 5000
};

const token = jwt.sign(payload, config.development.APISecret);
const email = "luanphung1357@gmail.com";
const options = {
    uri: `https://api.zoom.us/v2/users/${email}`, 
    qs: {
        'status': 'active' 
    },
    auth: {
        'bearer': token 
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
    },
    json: true // Parse the JSON string in the response
};
router.get("/", (req, res) => {
    res.send("Hello Zoom");
  });


  

module.exports = router;