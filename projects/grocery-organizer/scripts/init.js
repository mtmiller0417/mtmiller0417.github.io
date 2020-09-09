/// <reference path="../../../global-resources/jquery-3.5.1.js" />

let $listContainer;
let $newListItem;  // Copy of list item in initial state

let itemHTML = '';

function main(){

    // Set reference to list container
    $listContainer =  $('#list-container');

    initButtonFunctionality();

    // Handle when table input elements change
    $('#list-container .tr input').each( function(){
        // Ensure all values start at initial
        resetInputVal($(this));

        $(this).change(handleInputChange);

        // If the input is the who-cell input
        if( $(this).parent('.who-cell').length ){
            // Add event listener to change how tab works
            $(this).on('keydown', handleKeydown);
        }
        
    });

    // Deep copy the element and all event handlers
    $newListItem = $('#list-container .tr:first').clone(true);

    console.log('copy item', $newListItem)
    console.log('* * * * * * *');
}


function appendNewLine(){
    let $newEle = $newListItem.clone(true);
    $('#list-container').append($newEle);

    // Remove focus from whatever(if any) element currently has it
    $(document.activeElement).blur();

    // Focus on the new element
    $newEle.find('.item-cell input[type=text]').focus();
}

// Connects elements that can be clicked on with their action
function initButtonFunctionality(){
    // Get reference to buttons
    let $importBtn = $('#import-container label');
    let $exportBtn = $('#export-btn');
    let $clearBtn = $();

    $importBtn.on('click', handleImportBtn);
    $exportBtn.on('click', handleExportBtn);
    $clearBtn.on('click', handleClear);
}


// color: #777;

/*

    // Set MutationObserver settings
    let config = {
        attributes: true, 
        subtree: true
    };

    // Create mutation observer and callback function  
    let observer = new MutationObserver(listItemCallback);

    // Begin observing the node
    observer.observe($listItem.get(0), config);

 */