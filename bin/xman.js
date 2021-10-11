#!/usr/bin/env node
'use strict';


const { program } = require('commander');
const updateChk = require('../lib/update');

// 定义当前版本
program
	.version(require('../package').version, '-v, --version');

program
	.command('upgrade')
	.description("Check the js-plugin-cli version.")
	.alias('u')
	.action(() => {
		updateChk();
	});

program
	.command('add')
	.description('Add a new template')
	.alias('a')
	.action(() => {
		require('../command/add')()
	});

program
	.command('delete')
	.description('Delete a template')
	.alias('d')
	.action(() => {
		require('../command/delete')()
	});

program
	.command('init')
	.description('Generate a new project')
	.alias('i')
	.action(() => {
		require('../command/init')()
	});

program
	.command('list')
	.description('show temlpate list')
	.alias('l')
	.action(() => {
		require('../command/list')()
	});

program.parse(process.argv);

if (!program.args.length) {
	program.help();
}