
// 生成随机字符串的函数
function generateRandomStr(l = 5) {
    let source = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
        , str = "";
    for (var i = 0; i < l; i++) {
        let ind = ~~(Math.random() * source.length);
        str += source[ind];
    }
    return str;
}

module.exports = generateRandomStr;