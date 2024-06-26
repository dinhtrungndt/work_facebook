var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("./config");
const session = require("express-session");

const testLogin = require("./routes/testLogin");
// const http = require("http");
// const socketIo = require("socket.io");
const modelUrl = require("./models/url");
// const server = http.createServer(app);
// const io = socketIo(server, { cors: { origin: "*" } });

require("./models/accounts");

const User = require("./models/user.model");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var accountRouter = require("./routes/account");
var commentRouter = require("./routes/comment");
var testGetRouter = require("./routes/testGet");
var postsRouter = require("./routes/posts");
var cloudinaryRouter = require("./routes/cloundinary");

// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.authenticate("facebook", {
  scope: ["email", "user_photos", "user_posts", "user_birthday", 
  "user_hometown", "user_location", "user_likes", "user_events", "user_videos",
  "user_friends", "user_gender", "user_link", "user_age_range", "manage_fundraisers", "public_profile"
 ],
});

// Sử dụng FacebookStrategy cùng Passport.
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_key,
      clientSecret: config.facebook_secret,
      callbackURL: config.callback_url,
    },
    async function (accessToken, refreshToken, profile, cb) {
      // console.log("accessToken:", accessToken);
      let user = await User.findOne({
        accountId: profile.id,
        provider: "facebook",
      });
      if (!user) {
        user = new User({
          accountId: profile.id,
          name: profile.displayName,
          provider: profile.provider,
        });
        await user.save();
      }
      profile.accessToken = accessToken; // Attach the accessToken to the profile object
      return cb(null, profile);
    }
  )
);

// const link = passport._strategies.facebook._profileURL;
// console.log(
//   "passport passport:",
//   link + "?access_token=" + config.access_token
// );

// console.log(
//   "linklinklinklinklinklink:",
//   link + "?access_token=" + config.access_token
// );

// io.on("connection", (socket) => {
//   console.log("-- >> connected");
//   socket.on('send_urls', async (data) => {
//     try {
//       const
//     } catch (error) {
//       console.log("error socket.io connection", error);
//     }
//   });
// });

var app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Sử dụng body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(
    "mongodb+srv://GAME_2D_MD18102:GAME_2D_MD18102@md18102.lfzdm7y.mongodb.net/api-fb-work",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/accounts", accountRouter);
app.use("/comments", commentRouter);
app.use("/testLogin", testLogin);
app.use("/testGet", testGetRouter);
app.use("/posts", postsRouter);
app.use("/cloudinary", cloudinaryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
