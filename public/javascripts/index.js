

// ajax全局配置
$.ajaxSetup({
    beforeSend() {
        this.layerId = layer.load(0, {
            shade: [0.1, "#fff"]
        })
    },
    complete() {
        layer.close(this.layerId);
    },
    err() {
        layer.msg("网络异常");
    }
})

// tips 提示方法 参数一提示内容 参数二吸附元素选择器
function layerTip(str, sel) {
    layer.tips(str, sel, {
        tips: [4, '#3595CC'],
        time: 3000
    })
}

// 注册请求提交
$("body").delegate("#regist-modal-btn", "click", _ => {
    // 验证各项信息
    let reg = /^(\w|\W|[\u4e00-\u9fa5]){2,10}$/;
    if (!reg.test($("#regist-modal-account").val())) {
        layerTip("账号格式错误", "#regist-modal-account");
        return;
    }
    reg = /^\w{3,13}$/;
    if (!reg.test($("#regist-modal-psw").val())) {
        layerTip("密码格式错误", "#regist-modal-psw");
        return;
    }
    if ($("#regist-modal-psw").val() != $("#regist-modal-confirm").val()) {
        layerTip("两次密码输入不一致", "#regist-modal-confirm");
        return;
    }
    reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!reg.test($("#regist-modal-email").val())) {
        layerTip("邮箱格式错误", "#regist-modal-email");
        return;
    }
    // 获取参数发送请求
    let param = $("#regist-modal-form").serialize();
    $.post("/users/regist", param)
        .then(data => {
            if (!data.err) {
                $("#regist-modal").modal("hide");
                $("#regist-modal-form")[0].reset();
            }
            layer.msg(data.msg);
        });
});

// 注册点击更换图片验证码
changeCaptcha("#regist");

// 登录请求提交
$("body").delegate("#login-modal-btn", "click", _ => {
    let param = $("#login-modal-form").serialize();
    $.post("/users/login", param)
        .then(data => {
            layer.msg(data.msg);
            isLogin();
            $("#login-modal").modal("hide");
            $("#login-modal-form")[0].reset();
        });
})

// 登录点击更换图片验证码
changeCaptcha("#login");

function changeCaptcha(e) {
    $("body").delegate(e + "-captcha-change", "click", function () {
        let rnd = ~~(Math.random() * 100000000);
        $(e + "-captcha-img").attr("src", "/captcha?" + rnd);
    });
    // 登录和注册模态框打开时更新图片验证码
    $("body").delegate(e + "-modal-show", "click", function () {
        let rnd = ~~(Math.random() * 100000000);
        $(e + "-captcha-img").attr("src", "/captcha?" + rnd);
    });
}
$("body").delegate("#question-unlogin-click", "click", function () {
    let rnd = ~~(Math.random() * 100000000);
    $("#login-captcha-img").attr("src", "/captcha?" + rnd);
})


// 发布问题请求提交
$("body").delegate("#question-modal-btn", "click", _ => {
    let param = $("#question-modal-form").serialize();
    $.post("/question", param)
        .then(data => {
            $("#question-modal").modal("hide");
            $("#question-modal-form")[0].reset();
            renderQuestionList();
            layer.msg(data.msg);
        });
})

// 使用全局变量记录所选择的文件
var uploadFile = null;
$("#picID").on("change", e => {
    uploadFile = e.target.files[0];
})
// 图片上传请求提交
$("body").delegate('#avatar-modal-btn', "click", () => {
    if (!uploadFile) {
        layerTip("请先选择文件", "#picImg");
        return;
    }
    var data = new FormData();
    data.append("file", uploadFile);
    $.ajax({
        url: 'users/upload',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false
    })
        .then(data => {
            layer.msg(data.msg);
            isLogin();
            renderQuestionList();
            $("#avatar-modal").modal("hide");
            $("#picImg").attr("src", "images/noimage.png");
            uploadFile = null;
        })
});

var currentUser = null;
// 判断是否登录的函数
function isLogin() {
    let rnd = ~~(Math.random() * 100000000);
    $.get("/islogin?" + rnd)
        .then(data => {
            currentUser = data.user;
            // console.log(currentUser)
            let navList = new EJS({
                url: "/template/nav-list.ejs"
            })
                , htmlStr = navList.render({
                    user: currentUser,
                    rnd
                })
            $("#nav-list").html(htmlStr)
        })
}

$(isLogin);
// 退出登录请求发送
$("body").delegate("#logout-btn", "click", _ => {
    $.get("/users/logout")
        .then(data => {
            currentUser = null;
            layer.msg(data.msg);
            isLogin();
        })
})

$(renderQuestionList);
function renderQuestionList() {
    let rnd = ~~(Math.random() * 100000000);
    $.get("/questionList?" + rnd)
        .then(data => {
            console.log(data)
            let questionList = new EJS({
                url: "/template/question-list.ejs"
            })
                , htmlStr = questionList.render({
                    questions: data.questions,
                    rnd
                })
            $("#question-list").html(htmlStr)
        })
}

function answerClick(e) {
    // .prev() 查找上一个兄弟节点
    $(e.target).prev().show();
    $(e.target).text("提交回答");
    let answerContent = $(e.target).prev().val();
    if (!answerContent) {
        return;
    } else {
        $.post("/answer", `_id=${$(e.target).attr("qid")}&content=${answerContent}`)
            .then(data => {
                renderQuestionList();
                layer.msg(data.msg);
            })
    }
}
