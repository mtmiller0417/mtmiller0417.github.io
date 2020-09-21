/// <reference path="../../../global-resources/jquery-3.5.1.js" />
/**
 *    ### FILE CONTENTS ###
 * ---------------------------
 * This file contains all the event handler functions.
 * They are exported and will be imported to be made available 
 * for other files to use. This is done for code organization.
 * - Matt
 */

/* || 'click' events */

/**
 * Handles when the click event is triggered on the 
 * 'import' button by triggering the file input element
 * 
 * @param {Event} event The event object created
 */
function handleImportBtn(event){
    $('#import-container input[type=file]').trigger('click');
}

/**
 * Handles when the export button is clicked by displaying 
 * the output, which includes a button to download the output
 * as a file
 * @param {Event} event The event object created
 */
function handleExportBtn(event){
    let priorWidth = $(this).width();
    if( $(this).text().toLowerCase() === 'export' ){
        $(this).text('Hide');
    } else if( $(this).text().toLowerCase() === 'hide' ) {
        $(this).text('Export');
        $('#output').fadeOut('slow', function(){
            $(this).addClass('hidden');
        });
        return;
    }

    // Ensure width always stays the same
    $(this).width(priorWidth);

    // clear old export first
    clearOutput();

    let whoWhatData = calcWhoWhat(); 

    // Get name
    let name = $('#name-input').val();
    if(!name){
        name = 'Unnamed List';
    }

    // Set the name text
    $('#output section h1').text(name);
    // Set total price text
    $('#total-price-output').html('<b>Total: </b>$' + getAsNearestCent(whoWhatData.absTotal));
    // Set item quantity
    $('#items-amount-output').html( whoWhatData.itemAmount + ' Item(s)');
    // Set each person's total share
    appendPersonTotal('Alexa', whoWhatData.totals['a']);
    appendPersonTotal('Mia', whoWhatData.totals['m']);
    appendPersonTotal('Justin', whoWhatData.totals['j']);
    appendPersonTotal('Lili', whoWhatData.totals['l']);
    appendPersonTotal('Matt', whoWhatData.totals['m']);

    // Append receipt
    for(let line of whoWhatData.receiptList){
        //$('#receipt').append('<span>' + line + '</span>\n');

        //addReceiptRow();
    }

    // Make the output visible
    $('#output').fadeIn('slow', function(){
        $(this).removeClass('hidden');

        for(let i = 0; i < whoWhatData.dataList.length; i++){
            // Get variables
            let name = whoWhatData.dataList[i].itemName;
            let q = whoWhatData.dataList[i].itemQuantity;
            // Set receipt row
            addReceiptRow(name, q, whoWhatData.runningTotalList[i]);
        }
    });

    

    let text = getOutputasText();
}

/**
 * Handles when the content copy icon is clicked by 
 * copying the output the user's clipboard
 * @param {Event} event 
 */
function handleContentCopyBtn(event){
    let text = getOutputasText();

    copyToClipboard( text );
}

/**
 * Clears all the content on the page
 * @param {Event} event 
 */
function handleClear(event){
    // find diff options for alert  

    let selection = window.confirm(
        'Are you sure you want to clear the data?\n\
        This operation cannot be undone.'
    );
    
    if(selection){
        // Hide the output
        $('#output').addClass('hidden');
    }
}

/* || 'change' events */

/**
 * 
 * @param {Event} event The event object created
 */
function handleInputChange(event){
    let $target = $(this);

    let $itemName = $target.parents('.tr').find('.item-cell input[type=text]');
    let $itemQuantity = $target.parents('.tr').find('.item-cell input[type=number]');
    let $price = $target.parents('.tr').find('.price-cell input[type=text]');
    let $who = $target.parents('.tr').find('.who-cell input[type=text]');


    if( $target.is($itemName) ){
        if($target.val().trim() != '' && $target.val() != null){
            setInputValidity($target, 'valid');
        } else {
            setInputValidity($target, 'invalid');
        }
    }
    else if( $target.is($itemQuantity) ){
        // Attempt to conver the new value to an int
        let valAsInt = parseInt( $target.val() );

        // Check if it is not a valid int
        if( isNaN( valAsInt ) || valAsInt < 0 ){
            // If not, change it back to prior value  
            //valAsInt = $target.attr('data-prior-value');

            setInputValidity($target, 'invalid');

        } else {
            setInputValidity($target, 'valid');
            // If it is, update prior-value
            $target.attr('data-prior-value', valAsInt) 
        }

        // Set the value as a now valid int
        $target.val(valAsInt);

        // Update the total price
        updatePriceByQuantity($target, $price);
    }
    else if( $target.is($price) ){
        // Check if it's a valid number, if not note it as invalid
        if( checkValidNumber($target) ){
            setInputValidity($target, 'valid');
        } else {
            setInputValidity($target, 'invalid');
            return;
        }

        // Convert value to a money format N.NN
        convertValToMoney($target);

        // Set the unit price
        $target.attr('data-unit-price', $target.val());
        
        // Update the total price
        updatePriceByQuantity($itemQuantity, $target);
    }
    else if( $target.is($who) ){
        let arr = $target.val().split(splitRE);
        let validValues = 'a e m j l all'.split(' ');
        let valid = arr.every((entry, index) => {
            for(value of validValues){
                // if there is an 'all' it must be first
                if(entry.toLowerCase()  === 'all' && index != 0)
                    return false;
                if(entry.toLowerCase() === value)
                    return true;
            }
            // If the entry did not watch any validValue
            return false;
        });

        if(valid){
            setInputValidity($target, 'valid');
        } else {
            setInputValidity($target, 'invalid');
        }
    }

    // If every line entry has been filled out
    if($itemName.val() && $itemQuantity.val() && $price.val() && $who.val()){
        // Append new line( if the next line isnt empty )
        if( !$target.parents('.tr').next().length || !trIsEmpty($target.parents('.tr').next()) ){
            if( isRowValid($target.parents('.tr')) ){
                appendNewLine(); 
            }
            
        } else {
            //$(this).focus();
        }
    } 
    // If every input element(besides quantity) is empty *OR* if quantity is 0
    else if( (!$itemName.val() && !$price.val() && !$price.val() && !$who.val()) || ($itemQuantity.val() == 0) ){
        let $trList = $target.parents('#list-container').children('.tr');
        // If there is more than one tr and you're not deleting the last one
        if($trList.length > 1 && !$target.parents('.tr').is($trList.last())){
            // Remove the current empty one
            $target.parents('.tr').fadeOut(0.5, function(){
                $target.detach();
            });
        }
    }

}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function handleKeydown(event){
    let $tr = $(event.target).parents('.tr');

    if(event.key === 'Tab'){
        // If there are no next tr to tab to...
        if(!$(this).parents('.tr').next().length && isRowValid($tr)){
            // Tab was pressed
            // Supress default opetation 
            event.preventDefault();

            // Remove focus from this element to update its value
            // and possibly create new line
            $(this).blur();
        }
        
    }
}