#!/bin/bash +v

DEV_BRANCH=${DEV_BRANCH:=3.1}
MASTER_BRANCH=${MASTER_BRANCH:=3.1}
UPSTREAM_REMOTE=${UPSTREAM_REMOTE:=upstream}
DEPLOY_REMOTE=${DEPLOY_REMOTE:=live-old}

# ensure the development branch is up-to-date
git pull $UPSTREAM_REMOTE $DEV_BRANCH

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
git checkout -b release-$VN $DEV_BRANCH

# Update the VERSION_DEP file
echo $VN$MARKER > VERSION_DEP

ANNOUNCE=`date +"%b %d, %Y:"`" WDN Templates $VN released"

echo $ANNOUNCE

echo "Cancel now, if this is not what you want! (5 seconds)"
sleep 5

# Commit the version number change
git commit -a -m "Bumped dependency version number to $VN"

git checkout $MASTER_BRANCH

if [ $DEV_BRANCH != $MASTER_BRANCH ]; then
	# Make sure master is up to date if another developer performed a release
	echo "Updating master to upstream state"
	git pull $UPSTREAM_REMOTE $MASTER_BRANCH
fi

# Merge back to master
echo "Merging release branch into master"
git merge release-$VN

# Tag the release
echo "Tagging the release"
git tag -a $VN -m "Release $VN"

echo "Pushing master to origin, upstream, and live. Cancel now if this is not what you want! (5 seconds)"
sleep 5

# Push to live server!
echo "Pushing to origin and master server"
git push origin $MASTER_BRANCH
git push $UPSTREAM_REMOTE $MASTER_BRANCH --tags
git push $DEPLOY_REMOTE $MASTER_BRANCH

if [ $DEV_BRANCH != $MASTER_BRANCH ]; then
	# Now go back to develop and merge back in
	echo "Merging back to develop"
	git checkout $DEV_BRANCH
	git merge release-$VN
	
	# Now push to develop
	git push origin $DEV_BRANCH
	git push $UPSTREAM_REMOTE $DEV_BRANCH
fi

# Remove old branch
git branch -d release-$VN
