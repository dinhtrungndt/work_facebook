const express = require("express");
const router = express.Router();
const passport = require("passport");

// Trang chủ
router.get("/", (req, res) => {
  res.render("index", { user: req.user, accessToken: req.user?.accessToken });
});

// Trang login
router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

// Trang account (được bảo vệ)
router.get("/account", ensureAuthenticated, function (req, res) {
  res.render("account", { user: req.user });
});

// Xác thực Facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

// Xử lý callback sau khi Facebook xác thực
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/testLogin");
  }
);

// Đăng xuất
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Middleware để kiểm tra xác thực
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/testLogin/login");
}

module.exports = router;
