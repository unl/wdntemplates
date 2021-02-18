#!/bin/bash +v

DEV_BRANCH=${DEV_BRANCH:=5.3}
MASTER_BRANCH=${MASTER_BRANCH:=master}
UPSTREAM_REMOTE=${UPSTREAM_REMOTE:=upstream}
COMMITONLY='false'

while getopts :c option
  do
    case "${option}" in
      c) COMMITONLY='true'
      ;;
  esac
done


# save WIP and return to develop branch
git stash
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

# ensure the development branch is up-to-date
git checkout $DEV_BRANCH
git pull $UPSTREAM_REMOTE $DEV_BRANCH


if ${COMMITONLY}; then
    grunt bump-commit --dry-run || exit $?
else
    grunt bump --dry-run || exit $?
fi

echo "Cancel now, if this is not what you want! (5 seconds)"
sleep 5

if ${COMMITONLY}; then
    grunt bump-commit 
else
    grunt bump
fi



git checkout $MASTER_BRANCH

if [ $DEV_BRANCH != $MASTER_BRANCH ]; then
	# Make sure master is up to date if another developer performed a release
	echo "Updating master to upstream state"
	git pull $UPSTREAM_REMOTE $MASTER_BRANCH
	git merge $DEV_BRANCH
	git push origin $MASTER_BRANCH
	git push $UPSTREAM_REMOTE $MASTER_BRANCH
fi

# return from WIP
git checkout $CURRENT_BRANCH
git stash pop
