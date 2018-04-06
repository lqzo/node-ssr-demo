const mongoose = require("./connect.js")
    , userSchema = new mongoose.Schema({
        account: String,
        avatar: String,
        email: String,
        emailCode: String,
        isActive: Boolean,
        psw: String,
        regist_time:String
    })
    , User = mongoose.model("user", userSchema);
module.exports = User;