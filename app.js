var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fbgraph = require("fbgraphapi");
const bodyParser = require("body-parser");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(
  fbgraph.auth({
    appId: "453934460546244",
    appSecret: "f533b5582d1a5b3fbc90a10c80fb5b07",
    redirectUri: "http://localhost:3000/",
  })
);

app.get("/", async (req, res) => {
  const code = req.query.code;
  if (code) {
    try {
      const accessToken = await fbgraph.getAccessToken(code);
      const userProfile = await fbgraph.getUserProfile(accessToken);
      console.log("User Profile:", userProfile);
      // Lưu trữ accessToken và thông tin người dùng (userProfile) vào session hoặc cơ sở dữ liệu

      // Sau khi có accessToken, bạn có thể gọi đến Facebook Graph API để lấy danh sách comment
      const postId =
        "pfbid02iKrsVUWrAPZ6VUHC2zH7F7dNBrbwrXAkHPbkgx4yPpXuw9CoghpbXJRMw4woGWQ4l";
      const response = await axios.get(
        `https://graph.facebook.com/${postId}/comments?access_token=${accessToken}`
      );
      const comments = response.data.data;
      res.json(comments);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Chuyển hướng người dùng đến trang đăng nhập Facebook
    fbgraph.redirectLoginForm(req, res);
  }
});

app.use("/users", usersRouter);

app.get("/comment", async function async(req, res) {
  try {
    const idUser =
      "pfbid02iKrsVUWrAPZ6VUHC2zH7F7dNBrbwrXAkHPbkgx4yPpXuw9CoghpbXJRMw4woGWQ4l";
    const accessToken =
      "EAAGNO4a7r2wBOxDxR1aWzwn6sSiYWqsjdkOoOpXQGKyRRW1ebsP6Ox17Uz7KrMfEgX206FR9BPkaRLcCJIe9oFvJM78rpnlgbkvZAUsM8etwHlYgzezIh6naJUxLoJL681ZAMCfubXfvUQZA5dOEZAjd3n914hGAzZA0VOtMIKF8C3GDjbn7z3hunvEZCBwkjlMIoLQBxu5wZDZD";
    const response = await axios.get(
      `https://graph.facebook.com/${idUser}?access_token=${accessToken}`
    );
    if (response.data.error) {
      // Xử lý lỗi từ Facebook Graph API
      console.error("Error:", response.data.error.message);
      res.status(500).json({ error: response.data.error.message });
    } else {
      // Trích xuất dữ liệu comment từ phản hồi
      const comments = response.data.data;
      res.json(comments);
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

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
