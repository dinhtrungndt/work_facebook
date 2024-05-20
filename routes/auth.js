const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");

const appId = "453934460546244";
const appSecret = "f533b5582d1a5b3fbc90a10c80fb5b07";
const callbackURL = "http://localhost:3000/auth/facebook/callback";

passport.use(
  new FacebookStrategy(
    {
      clientID: appId,
      clientSecret: appSecret,
      callbackURL: callbackURL,
      profileFields: ["id", "displayName", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      // Xử lý thông tin người dùng và lưu trữ AccessToken
      console.log("Access Token:", accessToken);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = {
  passport,
  session,
};
