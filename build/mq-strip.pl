#!/usr/bin/env perl
use strict;

# print STDERR "$^V\n";
my $content = do { local $/; <STDIN> };

$content =~ s/\@media [^{]*\{\s+\}//g;
$content =~ s/\@media ([^{]*)\{((?:(?!\}\s*\}).)*\})\s*\}/($1 =~ \/\(max-width:\/) ? '' : $2/egis;

print $content;
