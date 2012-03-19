#!/bin/sh +v

if [ \! -f VERSION_DEP ]; then
    echo "Can't find version file"
    exit 1
fi

# Update the build number in the 'VERSION_DEP' file.
# Separate number from additional alpha/beta/etc marker
MARKER=`cat VERSION_DEP | sed 's/[0-9.]//g'`

# Bump the number
VN=`cat VERSION_DEP | sed 's/[^0-9.]//g'`

# Reassemble and write back out
VN=${VN%.*}.$((${VN##*.}+1))
echo $VN$MARKER > VERSION_DEP

ANNOUNCE=`date +"%b %d, %Y:"`" WDN Templates $VN released"

echo $ANNOUNCE

# Create the release-x.y.z branch
git checkout -b release-$VN develop

# Commit the version number change
git commit -a -m "Bumped dependency version number to $VN"

# Merge back to master
echo "Merging to master"
git checkout master
git merge --no-ff release-$VN

# Tag the release
echo "Tagging the release"
git tag -a $VN -m "Release $VN"

# Push to live server!
echo "Pushing to origin and master server"
git push origin master
git push upstream master
git push live master

# Now go back to develop and merge back in
echo "Merging back to develop"
git checkout develop
git merge --no-ff release-$VN

# Remove old branch
git branch -d release-$VN
