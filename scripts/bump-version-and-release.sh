#!/bin/bash +v

DEV_BRANCH=${DEV_BRANCH:=6.0}
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
    VERSION_DEP=line=$(head -n 1 VERSION_DEP)
    git tag -a $VERSION_DEP -m "Release $VERSION_DEP"
    git push upstream $DEV_BRANCH && git push upstream $VERSION_DEP
else
    VERSION_FILE="VERSION_DEP"
    VERSION_LINE=$(head -n 1 $VERSION_FILE)
    IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION_LINE"

    PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"

    echo "Current version: $VERSION_LINE"
    echo "New version: $NEW_VERSION"
    echo "Cancel now, if this is not what you want! (5 seconds)"
    sleep 5

    # Update VERSION_DEP
    echo "$NEW_VERSION" > $VERSION_FILE

    # Update package.json version
    if [ -f package.json ]; then
        sed -i '' -E "s/\"version\": *\"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$NEW_VERSION\"/" package.json
    fi

    git add $VERSION_FILE package.json
    git commit -m "Bump version to $NEW_VERSION"
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
