const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true},
    email: { type: String, required: true, trim: true, unique: true},
    username: { type: String, required: true, trim: true, unique: true},
    password: { type: String, required: true, trim: true, unique: true},
    profilePic: { type: String, default: "/images/profile.png"},
    likes: [{type: Schema.Types.ObjectId, ref:"Post"}]
},
{timestamps: true});

const User = mongoose.model("User", UserSchema);
module.exports = User;