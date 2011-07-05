#!/bin/sh
zip -r wdn.zip wdn -x "*/.svn/*"
echo "Done building the wdn.zip file."

zip -r UNLTemplates.zip Templates sharedcode -x "*/.svn/*"
echo "Done building the UNLTemplates.zip file."

zip -r affiliatepsds.zip designfiles/affiliate -x "*/.svn/*"
echo "Done building the affiliatepsds.zip file."

echo "Now running svn status *.zip"
svn status *.zip
echo "Any modified files are ready to be committed with svn commit *.zip"