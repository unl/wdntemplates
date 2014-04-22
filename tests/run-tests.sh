#'pear run-tests' doesn't exit with a failed status when there are failed tests. 
# This script wraps the pear command and returns the correct status to work with travis-ci

#run tests and capture the output
OUTPUT=$(pear run-tests -r tests); 

#echo the output
echo "$OUTPUT";

! echo "$OUTPUT" | grep -q "FAILED" || {
  #we found "FAILED" in the output.  Assume that it failed and echo all failed test output
  find tests -name *.out | xargs -t cat
  exit 1;
}

#exit with a success
exit 0;
