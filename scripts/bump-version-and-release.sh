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

# Reassemble next version number
VN=${VN%.*}.$((${VN##*.}+1))

# Create the release-x.y.z branch
git checkout -b release-$VN develop

# Update the VERSION_DEP file
echo $VN$MARKER > VERSION_DEP

ANNOUNCE=`date +"%b %d, %Y:"`" WDN Templates $VN released"

echo $ANNOUNCE

echo "Cancel now, if this is not what you want! (5 seconds)"
sleep 5

# Commit the version number change
git commit -a -m "Bumped dependency version number to $VN"

# Merge back to master
echo "Merging to master"
git checkout master
git merge --no-ff release-$VN

# Tag the release
echo "Tagging the release"
git tag -a $VN -m "Release $VN"

echo "Pushing master to origin, upstream, and live. Cancel now if this is not what you want! (5 seconds)"
sleep 5

# Push to live server!
echo "Pushing to origin and master server"
git push origin master
git push upstream master --tags
git push live master

# Now go back to develop and merge back in
echo "Merging back to develop"
git checkout develop
git merge --no-ff release-$VN

# Now push to develop
git push origin develop
git push upstream develop

# Remove old branch
git branch -d release-$VN
