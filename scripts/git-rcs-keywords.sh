#!/bin/sh

# Use this tool to install rcs-keywords filters

section="filter.rcs-keywords"
clean=".git_filters/rcs-keywords.clean"
smudge=".git_filters/rcs-keywords.smudge %f"

if [ "$1" = "remove" ]; then
    echo "Removing rcs-keywords filter from git-config"
    git config --remove-section $section
    echo "Done"
    exit
fi


if [ -z "`git config $section.clean`" -o -z "`git config $section.smudge`" ]; then
	echo "Writing rcs-keywords filter to git-config"
	git config $section.clean $clean
	git config $section.smudge "$smudge"
	echo "Done"
fi
