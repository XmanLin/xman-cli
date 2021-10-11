'use strict'
const config = require('../templates.json');
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const clear = require('clear');

module.exports = () => {
    clear();
    inquirer.prompt([
        {
            name: 'templateName',
            type: 'input',
            message: '请输入模板名称：',
            validate: function (value) {
                if (value.length) {
                    if (config.templates[value]) {
                        return '模板已存在，请重新输入';
                    } else {
                        return true;
                    }
                } else {
                    return '请输入模板名称';
                }
            },
        },
        {
            name: 'gitLink',
            type: 'input',
            message: '请输入 Git https link：',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return '请输入 Git https link';
                }
            },
        },
        {
            name: 'branch',
            type: 'input',
            message: '请输入分支名称：',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return '请输入分支名称';
                }
            },
        }
    ])
    .then(res => {
        config.templates[res.templateName] = {};
        config.templates[res.templateName]['url'] = res.gitLink.replace(/[\u0000-\u0019]/g, ''); // 过滤unicode字符
        config.templates[res.templateName]['branch'] = res.branch;
        fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config), 'utf-8', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(chalk.green('新模板添加成功！\n'));
            }
            process.exit();
        })
    })
    .catch(error => {
        console.log(error);
        console.log('发生了一个错误：', chalk.red(JSON.stringify(error)));
        process.exit();
    });
}