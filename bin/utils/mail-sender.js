
// 配置验证信息发送邮箱

let nodeMailer = require("nodemailer")
    , smtp = require("nodemailer-smtp-transport")
    , config = require("../../config.js")
    , smtpConfig = smtp({
        service: "163",
        auth: config.emailAccount
    })
    , mailSender = nodeMailer.createTransport(smtpConfig);

module.exports = mailSender;