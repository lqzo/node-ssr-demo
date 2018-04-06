//判断用户是否已经认证邮箱
module.exports = (req, res, next) => {
    if (req.session.user.isActive) {
        next();
    } else {
        res.json({ err: 7, msg: "请先认证邮箱激活账号" });
    }
}