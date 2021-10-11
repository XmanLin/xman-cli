'use strict';

const fs = require('fs');
const exec = require('child_process').exec;
const config = require('../templates');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const handlebars = require('handlebars'); //一种简单的模板语言 
const clui = require('clui');
const Spinner = clui.Spinner;
const status = new Spinner('正在下载...');
const removeDir = require('../lib/remove');

module.exports = () => {
    let gitUrl;
    let branch;
    clear();
    // 定制酷炫CLI头部
    console.log(chalk.yellow(figlet.textSync('XMAN-CLI', {
        horizontalLayout: 'full'
    })));
    inquirer.prompt([
        {
            name: 'templateName',
            type: 'list',
            message: '请选择你需要的项目模板：',
            choices: Object.keys(config.templates),
        },
        {
            name: 'projectName',
            type: 'input',
            message: '请输入你的项目名称：',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return '请输入你的项目名称';
                }
            },
        }
    ])
    .then(answers => {
        gitUrl = config.templates[answers.templateName].url;
        branch = config.templates[answers.templateName].branch;
        // 执行的命令，从git上克隆想要的项目模板
        let cmdStr = `git clone ${gitUrl} ${answers.projectName} && cd ${answers.projectName} && git checkout ${branch}`;
        status.start();
        exec(cmdStr, (error, stdou, stderr) => {
            status.stop();
            if (error) {
                console.log('发生了一个错误：', chalk.red(JSON.stringify(error)));
                process.exit();
            }
            const meta = {
                name: answers.projectName
            };
            // 这里需要注意：项目模板的 package.json 中的 name 要写成 "name": "{{name}}"的形式
            const content = fs.readFileSync(`${answers.projectName}/package.json`).toString();
            // 利用handlebars.compile来进行 {{name}} 的填写 
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(`${answers.projectName}/package.json`, result);
            // 删除模板自带的 .git 文件
            removeDir(`${answers.projectName}/.git`);
            console.log(chalk.green('\n √ 下载完成!'));
            console.log(chalk.cyan(`\n cd ${answers.projectName} && yarn \n`));
            process.exit();
        })
    })
    .catch(error => {
        console.log(error);
        console.log('发生了一个错误：', chalk.red(JSON.stringify(error)));
        process.exit();
    });
}