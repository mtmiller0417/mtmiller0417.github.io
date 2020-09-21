/// <reference path="../../../global-resources/jquery-3.5.1.js" />

function generateCopyString(){
    let $listContainer = $('#list-container');
    let copyStr = '';

    $('#list-container .tr').each(function(){
        let rowStr = '';

        rowStr += '(' + $(this) + ')';
    });
}