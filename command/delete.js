'use strict';

const fs = require('fs');
const config = require('../templates');
const chalk = require('chalk');
const inquirer = require('inquirer');
const clear = require('clear');

module.exports = () => {
    clear();
    inquirer.prompt([
        {
            name: 'templateName',
            type: 'input',
            message: '请输入要删除的模板名称：',
            validate: function (value) {
                if (value.length) {
                    if (!config.templates[value]) {
                        return '模板不存在，请重新输入';
                    } else {
                        return true;
                    }
                } else {
                    return '请输入要删除的模板名称';
                }
            },
        }
    ])
    .then(res => {
        config.templates[res.templateName] = undefined;
        fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config), 'utf-8', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(chalk.green('模板已删除！'));
            }
            process.exit();
        });
    })
    .catch(error => {
        console.log(error);
        console.log('发生了一个错误：', chalk.red(JSON.stringify(error)));
        process.exit();
    });
}