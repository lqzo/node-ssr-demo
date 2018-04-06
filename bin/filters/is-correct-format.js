
// 验证注册信息格式正确的函数
// 参数是req和res,返回值是一个布尔值
function isCorrectFormat(req, res, next) {
    let isCorrectFormat = true
        , reg = /^(\w|\W|[\u4e00-\u9fa5]){2,10}$/;
    if (!reg.test(req.body.username)) {
        isCorrectFormat = false;
    }
    reg = /^\w{3,13}$/;
    if (!reg.test(req.body.password)) {
        isCorrectFormat = false;
    }
    reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!reg.test(req.body.email)) {
        isCorrectFormat = false;
    }
    if (isCorrectFormat) {
        next();
    } else {
        res.json({ err: 1, msg: "数据格式错误" });
    }
}

module.exports = isCorrectFormat;