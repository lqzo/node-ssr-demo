
module.exports = (req, res, next) => {
    if (req.body.captcha.toUpperCase()
        != req.session.captcha.toUpperCase()) {
        res.json({ err: 2, msg: "验证码错误" })
        return;
    }
    next();
}