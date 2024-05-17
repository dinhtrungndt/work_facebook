// var express = require("express");
// var router = express.Router();
// const accountsModel = require("../models/accounts");

// router.get("/", async (req, res) => {
//   try {
//     const data = await accountsModel.find();
//     res.json(data);
//     console.log(data);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
  
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser');
const accountsModel = require("../models/accounts");
require('dotenv').config();
const axios = require('axios');
const accessToken = process.env.ACCESS_TOKEN;
var graph = require('fbgraph');
// console.log(accessToken);
graph.setAccessToken(accessToken);
// Route để xử lý yêu cầu GET
const userId = '100009347046436';
router.get("/", async (req, res) => {
  console.log(`https://graph.facebook.com/me?fields=id,name,posts{message}&access_token=${accessToken}`);
  try {
    console.log('1')
        
    //const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,posts{message}&access_token=${accessToken}`);
    console.log('2')
    console.log(`https://graph.facebook.com/me?fields=id,name,posts{message}&access_token=${accessToken}`);
    //res.json(response.data);
} catch (error) {
  console.error("Error:", error);
    res.status(500).send(error.toString());
}
});

module.exports = router;
