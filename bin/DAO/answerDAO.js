const mongoose = require("./connect.js")
    , answerSchema = new mongoose.Schema({
        content: String,
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "question"
        },
        replier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        time: String
    })
    , Answer = mongoose.model("answer", answerSchema);
module.exports = Answer;