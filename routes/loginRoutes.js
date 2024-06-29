const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/userSchema");

router.get("/", (req, res) => {
  const pageData = {
    title: "User Login",
  };
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).render("Login", pageData);
});

router.post("/", async(req, res) => {
   const pageData = req.body;
   pageData.title = "User Login";
   const username = req.body.username.trim();
   const password = req.body.password.trim();
   if( username && password) {
      const user = await User.findOne({ username: req.body.username.trim() }).catch((err) => {
        console.log(err);
        pageData.errorMessage = "Something went wrong..!"
        res.status(200).render("Login", pageData);
      });
      if(user != null){
       const result = await bcrypt.compare(password,user.password);
       if(result === true){
        req.session.socialMedia = user;
        return res.redirect("/home");
       } else{
        pageData.errorMessage = "Login Credential incorrect..!"
        res.status(200).render("Login", pageData);
       }
      } else {
        pageData.errorMessage = "Login Credential incorrect..!"
        res.status(200).render("Login", pageData);
      }

   } else {
    pageData.errorMessage = "Make Sure each field has a valid value";
    res.status(200).render("Login", pageData);
   }
})

module.exports = router;
