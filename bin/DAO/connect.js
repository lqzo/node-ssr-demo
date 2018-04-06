const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/online_q_a_system",
    err =>
        console.log(err ? err : "OK")
)
module.exports = mongoose;
