#!/bin/bash
if [ ! -d ".git_filters" ]; then
    echo "The script must be run from the repository root"
    exit 1
fi

# This array should match what's in .gitattributes
SRC_PATHS=(
	"Templates/*dwt*"
	"wdn/templates_4.0/includes/scriptsandstyles*.html"
)

for j in ${SRC_PATHS[@]}; do
	for i in `ls $j`; do
		./.git_filters/rcs-keywords.smudge $i < $i > temp
		mv temp $i
	done
done

rm -f temp
