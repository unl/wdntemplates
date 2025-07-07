/* eslint-disable */
"use strict";

var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');

var rcsKeywords = [
	'Id',
	'Date',
	'Author',
	'Source',
	'File',
	'Revision',
	'Header',
	'Commit',
	'Name'
];
// map of keywords to RegExp is group 1 as the prefix and group 2 as the suffix
var staticTokens = {
	"HTML_VERSION" : /(data-version=")[^"]*(")/g,
	"DEP_VERSION" : /(\?dep=)[^"]*(")/g
};

var smudgeValues = {};

module.exports = {
	clean : function(content, asReturn) {
		content = content.replace(new RegExp('\\$(' + rcsKeywords.join('|') + ')[^$]*\\$', 'g'), '$$$1$$');

		for (var i in staticTokens) {
			content = content.replace(staticTokens[i], '$1$$' + i + '$$$2');
		}

		if (asReturn) {
			return content;
		}

		console.log(content);
	},
	_startSmudge : function(filepath) {
		var defaultMatchFail = ['', ''];
		var filename = path.basename(filepath);
		var tag = childProcess.execSync('git describe --always --tag').toString().trim();
		var rev = childProcess.execSync('git log -n 1 -- ' + filepath + ' | head -n 4').toString();
		var commit = (/^commit (.*)$/m.exec(rev) || defaultMatchFail)[1];
		var date = (/^Date:\s*(.*)\s*$/m.exec(rev) || defaultMatchFail)[1];
		var author = (/^Author:\s*(.*)\s*$/m.exec(rev) || defaultMatchFail)[1];
		var name = (/\s*(.*)\s*<.*/.exec(author) || defaultMatchFail)[1];
		var htmlVers = fs.readFileSync('VERSION_HTML').toString().trim();
		var depVers = fs.readFileSync('VERSION_DEP').toString().trim();

		smudgeValues = {
			"filepath" : filepath,
			"filename" : filename,
			"tag" : tag,
			"commit" : commit,
			"date" : date,
			"author" : author,
			"name" : name,
			"htmlVers" : htmlVers,
			"depVers" : depVers
		};

		return smudgeValues;
	},
	smudge : function(content, asReturn) {
		var currentKeyword = '';
		var replacement = '';

		for (var i = rcsKeywords.length; i >= 0; i--) {
			currentKeyword = rcsKeywords[i];
			replacement = '$$$1: ';
			switch (currentKeyword) {
				case 'Id':
					replacement += [smudgeValues.filename, smudgeValues.commit, smudgeValues.date, smudgeValues.name].join(' | ');
					break;
				case 'Date':
					replacement += smudgeValues.date;
					break;
				case 'Author':
					replacement += smudgeValues.author;
					break;
				case 'Source':
					replacement += smudgeValues.filepath;
					break;
				case 'File':
					replacement += smudgeValues.filename;
					break;
				case 'Revision':
				case 'Commit':
					replacement += smudgeValues.commit;
					break;
				case 'Header':
					replacement += [smudgeValues.filepath, smudgeValues.commit, smudgeValues.date, smudgeValues.name].join(' ');
					break;
				case 'Name':
					replacement += smudgeValues.tag;
					break;
			}
			replacement += ' $$';

			content = content.replace(new RegExp('\\$(' + currentKeyword + ')[^$]*\\$', 'g'), replacement);
		}

		for (i in staticTokens) {
			currentKeyword = i;
			replacement = '';
			switch (currentKeyword) {
				case 'HTML_VERSION':
					replacement += smudgeValues.htmlVers;
					break;
				case 'DEP_VERSION':
					replacement += smudgeValues.depVers;
					break;
			}

			content = content.replace(new RegExp('\\$' + currentKeyword + '\\$', 'g'), replacement);
			replacement = '$1' + replacement + '$2';
			content = content.replace(staticTokens[i], replacement);
		}

		if (asReturn) {
			return content;
		}

		console.log(content);
	}
};
