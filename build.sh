zip -r wdn wdn -x "*/.svn/*"
zip -r UNLTemplates Templates sharedcode -x "*/.svn/*"

php wdn/templates_3.0/build/compress.php
