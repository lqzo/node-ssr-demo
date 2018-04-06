//判断是否登录的函数
module.exports = (req, res, next) => {
    if (!req.session.user) {
        res.json({ err: 6, msg: "请先登录" });
    } else {
        next();
    }
}