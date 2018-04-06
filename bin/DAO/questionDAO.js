const mongoose = require("./connect.js")
    , questionSchema = new mongoose.Schema({
        answers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "answer"
            }
        ],
        caption: String,
        content: String,
        last_answer_time: String,
        quizzer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        time: String
    })
    , Question = mongoose.model("question", questionSchema);
module.exports = Question;