#!/bin/sh

# Use this tool to install rcs-keywords filters

cleanKey="filter.rcs-keywords.clean"
cleanValue=".git_filters/rcs-keywords.clean"
smudgeKey="filter.rcs-keywords.smudge"
smudgeValue=".git_filters/rcs-keywords.smudge %f"

if [ -z "`git config $cleanKey`" -o -z "`git config $smudgeKey`" ]; then
	echo "Writing rcs-keywords filter to git-config"
	git config $cleanKey $cleanValue
	git config $smudgeKey $smudgeValue
	echo "Done"
fi