const express = require('express')
    , md5 = require("md5")
    , fs = require('fs')
    , path = require('path')
    , router = express.Router()
    , User = require("../bin/DAO/userDAO.js")
    // 注册信息验证函数 过滤非正常注册
    , isCorrectFormat = require("../bin/filters/is-correct-format.js")
    , isTrueCaptcha = require("../bin/filters/is-true-captcha.js")
    , isLogin = require("../bin/filters/is-login.js")
    , isActive = require("../bin/filters/is-active.js")
    , getTime = require("../bin/utils/get-time.js")
    , generate = require("../bin/utils/get-random-str.js")
    , sendMail = require("../bin/utils/mail-send.js")
    , upload = require("../bin/utils/upload.js");
// 注册接口
router.post("/regist", isTrueCaptcha, isCorrectFormat, (req, res) => {
    User.findOne({ account: req.body.account })
        .then(data => {
            if (data) {
                res.json({ err: 3, msg: "该用户名已被占用" });
            } else {
                req.body.psw = md5(req.body.psw);
                //生成邮件验证码
                let emailCode = generate(15)
                    , regist_time = getTime()
                    , u = new User({
                        ...req.body,
                        avatar: "default.jpg",
                        isActive: false,
                        regist_time,
                        emailCode
                    });
                u.save()
                    .then(_ => {
                        //发送验证邮件
                        let msg = sendMail(u);
                        res.json({ err: 0, msg });
                    });
            }
        })
        .catch(err => res.json({ err: 4, msg: "数据库操作失败" }));
})
    //登录接口
    .post("/login", isTrueCaptcha, (req, res) => {
        req.body.psw = md5(req.body.psw);
        User.findOne({ account: req.body.account, psw: req.body.psw })
            .then(data => {
                if (data) {
                    req.session.user = data;
                    res.json({ err: 0, msg: "登录成功" });
                } else {
                    res.json({ err: 5, msg: "账号或密码错误" });
                }
            })
            .catch(err => res.json({ err: 4, msg: "数据库操作失败" }));
    })
    // 退出登录接口
    .get("/logout", isLogin, (req, res) => {
        // req.session.destroy();
        // 只清空req.session.user
        delete req.session.user;
        // console.log(req.session)
        res.json({ err: 0, msg: "成功退出登录" });
    })
    //邮件验证接口
    .get("/auth", (req, res) => {
        User.findOne({ emailCode: req.query.emailCode })
            .then(data => {
                if (data) {
                    data.isActive = true;
                    data.emailCode = "";
                    data.save()
                        .then(() => {
                            res.send("您的账号已验证通过，请重新登陆");
                        });
                } else {
                    res.send("验证失败");
                }
            });
    })
    // 头像上传接口
    .post("/upload", isLogin, isActive, (req, res, next) => {
        // 删除原头像
        User.findOne({ _id: req.session.user._id })
            .then(data => {
                if (data.avatar != "default.jpg") {
                    fs.unlinkSync("./public/avatar/" + data.avatar);
                }
                next();
            })
            .catch(() => {
                res.json({ err: 4, msg: "数据库错误" });
            });
    }, upload.single("file"), (req, res) => {
        User.update({ _id: req.session.user._id }, { avatar: req.userAvatar })
            .then(() => {
                res.json({ err: 0, msg: "头像上传完毕" });
            })
            .catch(err => {
                res.json({ err: 6, msg: "数据库存储失败" });
            });
    });

module.exports = router;
