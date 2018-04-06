const express = require('express')
  , router = express.Router()
  , captcha = require("../bin/utils/get-captcha.js")
  , getTime = require("../bin/utils/get-time.js")
  , isLogin = require("../bin/filters/is-login.js")
  , isActive = require("../bin/filters/is-active.js")
  , User = require("../bin/DAO/userDAO.js")
  , Question = require("../bin/DAO/questionDAO.js")
  , Answer = require("../bin/DAO/answerDAO.js");
// 生成图片验证码并返回
router.get("/captcha", (req, res) => {
  let arr = captcha.get();
  req.session.captcha = arr[0];
  res.set("Content-Type", "image/bmp");
  res.send(arr[1]);
})
  .get("/islogin", isLogin, (req, res) => {
    User.findOne({ _id: req.session.user._id })
      .then(user => {
        req.session.user = user;
        res.json({ err: 0, msg: `用户：${req.session.user.account}已登录`, user })
      })
  })
  .post("/question", isLogin, isActive, (req, res) => {
    // console.log(req.body)
    let time = getTime()
      , q = new Question({
        caption: req.body.caption,
        content: req.body.content.trim(),
        last_answer_time: time,
        quizzer: req.session.user._id,
        time
      })
    q.save()
      .then(_ => {
        res.json({ err: 0, msg: "您的提问已发布成功" })
      })
      .catch(err => {
        res.json({ err: 4, msg: "数据库操作失败" })
      })
  })
  .get("/questionList", (req, res) => {
    Question.find()
      .populate("quizzer", "account -_id avatar")
      .populate({
        path: "answers",
        populate: {
          path: "replier",
          select: { account: 1, _id: 0, avatar: 1 }
        }
      })  
      .sort({ last_answer_time: -1 })
      .then(data => {
        // console.log(data)
        res.json({ err: 0, msg: "查询成功", questions: data })
      })
      .catch(err => {
        res.json({ err: 4, msg: "数据库操作失败" })
      })
  })
  .post("/answer", isLogin, isActive, (req, res) => {
    let time = getTime()
      , a = new Answer({
        content: req.body.content,
        question: req.body._id,
        replier: req.session.user._id,
        time
      });
    // console.log(req.body._id)
    a.save()
      .then(_ => {
        return Question.findOne({ _id: req.body._id })
          .then(data => {
            data.last_answer_time = time;
            data.answers.push(a._id);
            return data.save()
          })
      })
      .then(_ => {
        res.json({ err: 0, msg: "回答提交成功" })
      })
      .catch(err => res.json({ err: 4, msg: "数据库操作失败" }))
  })
module.exports = router;
