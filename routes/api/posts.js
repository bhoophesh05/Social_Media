const express = require("express");
const router = express.Router();

const User = require("../../schemas/userSchema");
const Post = require("../../schemas/postSchema");


//to get all post details
router.get("/", (req,res) => {
    Post.find().populate("postedBy").sort({createAt: 1})
    .then((results) => {
        return res.status(200).send(results);
    })
    .catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });
});

//to save post details
router.post("/",async (req,res) => {
    console.log(req.body);
    if(!req.body.content.trim()){
        console.log("Content Not Found");
        return res.status(400);  
    }
    const postData = {
        content: req.body.content,
        postedBy: req.session.socialMedia,
    };

    Post.create(postData).then(async (newPost) => {
        newPost = await User.populate(newPost, {path: "postedBy"})
        return res.status(200).send(newPost);
    })
});

//like post
router.put("/:id/like", async (req,res) => {
    const postId = req.params.id;
    const userId = req.session.socialMedia._id;
    const isLiked = req.session.socialMedia.likes && req.session.socialMedia.likes.includes(postId);
    const option = isLiked ? "$pull" : "$addToSet";
    req.session.socialMedia = await User.findByIdAndUpdate(userId,{[option] : {likes: postId}}, {new: true}).catch((err) => {
        console.log(error);
        req.sendStatus(400);
    });
    res.status(200).send({status: "good"});
})

module.exports = router;