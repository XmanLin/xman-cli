const fs = require('fs');
let path = require('path');

function removeDir(dir) {
    let files = fs.readdirSync(dir); //返回一个包含“指定目录下所有文件名称”的数组对象
    for (var i = 0; i < files.length; i++) {
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath); // 获取fs.Stats 对象
        if (stat.isDirectory()) {
            //判断是否是文件夹，如果是文件夹就递归下去
            removeDir(newPath);
        } else {
            //删除文件
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir); //如果文件夹是空的，就将自己删除掉
};

module.exports = removeDir;