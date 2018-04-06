
//ccap模块，用于生成图片验证码
var ccap = require("ccap");

//导入生成随机字符串的函数
var generate = require("./get-random-str.js");

var captcha = ccap({
    width:200,
    height:60,
    //字间距
    offset:30,
    //图片质量，100最高，0最低。
    quality:100,
    fontsize:50,
    //生成验证码的函数，需要返回一个字符串
    generate
});

// 导出配置过的captcha对象
module.exports = captcha;