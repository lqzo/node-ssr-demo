
// 导入验证邮件的发送邮箱对象
const mailSender = require("./mail-sender.js");
// 发送验证邮件的函数
function sendMail(user) {
    let msg = "",
        url = "http://xxx.xxx.xxx.xxx:3000"
    mailSender.sendMail({
        from: "xxxxx@163.com",
        to: user.email,
        subject: "验证邮件",
        html: `
        <h1>欢迎使用在线问答系统</h1>
        <p>点击下方链接进行邮箱验证</p>
        <a href="${url}/users/auth?emailCode=${user.emailCode}">${url}/users/auth?emailCode=${user.emailCode}</a>
        `
    }, (err) => {
        console.log(err ? err : "邮件发送成功");
        msg = err ? "验证邮件发送失败" + err : " 注册成功,请登陆您的邮箱进行验证";
    });
    return msg;
}

module.exports = sendMail;