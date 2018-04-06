// 上传文件的模块配置对象
const multer = require("multer")
    , storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/avatar');
        },
        filename: function (req, file, cb) {
            var fileName = req.session.user._id + "." + file.mimetype.split("/")[1];
            req.userAvatar = fileName;
            cb(null, fileName);
        }
    }),
    upload = multer({ storage });
module.exports = upload;