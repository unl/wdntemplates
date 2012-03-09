#!/bin/sh
if [ ! -d ".git_filters" ]; then
    echo "The script must be run from the repository root"
    exit 1
fi

dir="Templates"
for i in `ls $dir`; do
    echo "Cleaning Template: $i"
	./.git_filters/rcs-keywords.clean < $dir/$i > $dir/temp
	mv $dir/temp $dir/$i
done
rm -f Templates/temp
echo "Done"
