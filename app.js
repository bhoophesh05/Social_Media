const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const connectDB = require("./db/connect");
const middleware = require("./middleware/middleware");

const app = express();
const port = process.env.PORT;

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret: "social_media",
  resave: true,
  saveUninitialized: false,
}))
const staticUri = path.join(__dirname, "public");
app.use(express.static(staticUri));

//routes
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/logoutRoutes");

app.use("/register", middleware.isLogin, registerRoute);
app.use("/login", middleware.isLogin, loginRoute);
app.use("/logout", logoutRoute);

//home page
app.get(["/", "/home", "/index"], middleware.isAlreadyLogin, (req, res) => {
  const pageData = {
    title: "Home Page",
    userDetails:req.session.socialMedia,
    userDetailsJson: JSON.stringify(req.session.socialMedia), 
  }
  res.status(200).render("home", pageData);
});

//settings page
app.get("/settings", middleware.isAlreadyLogin, (req, res) => {
  const pageData = {
    title: "Settings",
    userDetails:req.session.socialMedia  
  }
  res.status(200).render("settings", pageData);
});

//API ROutees
const postApiRoutes = require("./routes/api/posts");
app.use("/api/posts", postApiRoutes);

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
