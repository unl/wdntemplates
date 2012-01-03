#!/bin/sh
zip -r downloads/wdn.zip wdn -x "*/.git*"
echo "Done building the wdn.zip file."

zip -r downloads/UNLTemplates.zip Templates sharedcode -x "*/.git*"
echo "Done building the UNLTemplates.zip file."

zip -r downloads/affiliatepsds.zip designfiles/affiliate -x "*/.git*"
echo "Done building the affiliatepsds.zip file."

echo "Now running git status *.zip"
git status *.zip
echo "Any modified files are ready to be committed with git commit *.zip"