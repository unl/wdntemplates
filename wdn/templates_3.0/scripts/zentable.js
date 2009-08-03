/**
 * Handles the striping of the zentables and loading the stylesheet
 
 */
 WDN.zentable = function() {
    return {
        initialize : function() {
            jQuery('table.zentable tbody tr:nth-child(odd)').addClass('rowEven');
            jQuery('table.zentable tbody tr:nth-child(even)').addClass('rowOdd');
        }
    }
}();