
module.exports = _=>{
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = now.getDate();
    day = day < 10 ? "0" + day : day;
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return time;
}
