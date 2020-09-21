/// <reference path="../../../global-resources/jquery-3.5.1.js" />

let splitRE =  /,\s|,|\s|,\s*/;

/**
 * Round-up or round-down?
 * @param {JQuery} $element A JQuery object
 */
function convertValToMoney($element){
    // Convert number to 2 decimal places
    $element.val( 
        parseFloat( Math.max( 0.00, $element.val() ) ).toFixed(2)
    );
}

/**
 * 
 * @param {JQuery} $element JQuery object
 */
function checkValidNumber($element){
    if( isNaN(parseFloat($element.val())) || parseFloat($element.val) <= 0 ){
        //$element.val(null);    
        return false;
    }
    return true;
}

/**
 * Calculates and sets the total price of the item based off of
 * the price and quantity
 * @param {JQuery} $itemQuantity itemQuantity JQuery object
 * @param {JQuery} $price price JQuery object
 */
function updatePriceByQuantity($itemQuantity, $price){
    // Only run if a price is set
    if( $price.val() ){
        // Get the unit price as float for calculation
        let unitPrice = parseFloat( $price.attr('data-unit-price') );

        // Multiply unit price by valid quantity to get new price
        $price.val( parseFloat( $itemQuantity.val() ) * unitPrice );

        // Convert new price to dollar amount format
        convertValToMoney( $price );
    }
}

/**
 * 
 * @param {JQuery} $input 
 */
function resetInputVal($input){
    if( $input.parent('.item-cell').length && $input.attr('type') == 'number'){
        // Set value of quantity input to 1
        $input.val(1);
    } else {
        $input.val(null);
    }
}

/**
 * Removes all text content from the output section
 */
function clearOutput(){
    $('#output h1').text('');
    $('#total-price-output').html('<b>Total:</b>');
    $('#items-amount-output').html('<b>Items</b>');

    $('#totals').children().each(function(){
        $(this).detach();
    });
    $('#receipt').children().not('b').not('#receipt-header').each(function(){
        $(this).detach();
    });
}

/**
 * @returns { 
 *      { 
 *          dataList: [{
 *              itemName:string, itemQuantity:string, unitPrice:string, totalPrice:string ,who:string
 *          }], 
 *          receiptList: string[],
 *          totals: {
 *              a:number, e:number, j:number, l:number, m:number
 *          }, 
 *          absTotal: number,
 *          itemAmount: number
 *      } 
 * }
 */
function calcWhoWhat(){
    let dataList = [];
    let receiptList = [];
    let runningTotal = {
        a: 0,
        e: 0, 
        j: 0, 
        l: 0,
        m: 0
    };
    /* { a:Number, e:Number, m:Number, j:Number, l:Number } */
    let runningTotalList = []; 
    let absTotal = 0;
    let itemAmount = 0;

    // Split on "," OR ", " OR " " OR ", *"(any amount of spaces after ',')
    //var re = /,\s|,|\s|,\s*/; 

    $('#list-container .tr').each(function(){
        if( $(this).find('.item-cell input:first').val() && $(this).find('.quantity').val() !== 0 ){
            // Get the elements
            let $tmp = $(this).find('.who-cell input').val().toLowerCase();
            if($tmp.toLowerCase() === 'all'){
                $tmp = 'a e j l m';
            }

            let newDataRow = {
                itemName: $(this).find('.item-cell input:first').val(),
                itemQuantity: $(this).find('.item-cell input:last').val(),
                unitPrice: $(this).find('.price-cell input').attr('data-unit-price'),
                totalPrice: $(this).find('.price-cell input').val(),
                who: $tmp.split(splitRE)
            };

            // Push the row elements directly into the dataList variable
            dataList.push(newDataRow);

            let rowReceipt = { a: '+$0.00', e: '+$0.00', j: '+$0.00', l: '+$0.00', m: '+$0.00' };
            absTotal += parseFloat(newDataRow.totalPrice);
            itemAmount += parseInt (newDataRow.itemQuantity);
            
            let rowReceiptTotal = { a: 0, e: 0, m: 0, j: 0, l: 0  };

            let priceEach = newDataRow.totalPrice / newDataRow.who.length;
            for(let person of newDataRow.who){
                // Split the price of who bought it and add it to each of their total 
                runningTotal[person] += priceEach;
                rowReceipt[person] = '+$' + getAsNearestCent(priceEach) + '';
                rowReceiptTotal[person] = priceEach;
            }

            runningTotalList.push(rowReceiptTotal);

            let receiptStr = newDataRow.itemQuantity + ' ' + newDataRow.itemName  + 
                '(s) $' + getAsNearestCent( newDataRow.totalPrice ) + ' ' +
                ' : ' + 
                'Alexa:' + rowReceipt.a +
                ' Mia:' + rowReceipt.e +
                ' Justin:' + rowReceipt.j +
                ' Lili:' + rowReceipt.l +
                ' Matt:' + rowReceipt.m;
            
            receiptList.push(receiptStr);
        } else {
            // Don't do anything
        }        
    });

    return {
        dataList: dataList,
        receiptList: receiptList, 
        totals: runningTotal,
        absTotal: absTotal,
        itemAmount: itemAmount,
        runningTotalList: runningTotalList
    }
}

/**
 * 
 * @param {String | Number} value Amount as a string or number
 */
function getAsNearestCent(value){
    // nearest defaults to true
    value = value.toString();
    return parseFloat(value).toFixed(2);
}

function numToDollar(value){
    return getAsNearestCent(value);
}

function appendPersonTotal(name, totalStr){
    let elementStr = '<span><b>' + name + ':&nbsp;</b>$' + numToDollar(totalStr) + '</span>\n';
    $('#totals').append( elementStr );
}

function getOutputasText(){
    let lines = [];

    $('#output section').children().each(function(){
        if($(this).is( $('#receipt') )){
            $(this).children().each(function(){
                lines.push( getElementAsString($(this)) );
            });
        } else {
            lines.push( getElementAsString($(this)) );
        }
    });

    return lines.join('\n');
}

function getElementAsString($element){
    return $element[0].innerText.split(/\n|\s+/).filter(item => item.trim()).join(' ');
}

/**
 * 
 * @param {JQuery} $tr 
 */
function trIsEmpty($tr){
    $tr.find('input').not('.quantity').each(function(){
        if( $(this).val() ){
            return false;
        }
    });
    return true;
}

function copyToClipboard(text) {
    let $temp = $('<textarea>');
    $temp.html(text);
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy", false, null);
    $temp.remove();

    copiedNotification();
}


function copiedNotification(){
    let $cn = $('#copied-notification');
    $cn.css('opacity', '.6');
    setTimeout(function(){
       $cn.css('opacity', '0');
    }, 3000);
}

/**
 * 
 * @param {JQuery} $input 
 */
function signalValidInput($input){
    let validBkgColor = rgba(109, 255, 109, 0.5);
    $input.css('background-color',validBkgColor);
}

/**
 * 
 * @param {JQuery} $input 
 */
function signalInalidInput($input){
    let invalidBkgColor = rgba(255, 0, 0, 0.5);
    $input.css('background-color', invalidBkgColor);
}

/**
 * 
 * @param {JQuery} $input
 * @param {['valid', 'invalid']} validityStr one of 'valid' or 'invalid'
 */
function setInputValidity($input, validityStr){
    validityStr = validityStr.toLowerCase();

    if(validityStr === 'valid'){
        $input.attr('data-valid', 'valid');
        $input.parents('.tr').find('input[readonly="readonly"]').each(function(){
            $(this).removeAttr('readonly');
        });
    } 
    else if(validityStr === 'invalid'){
        $input.attr('data-valid', 'invalid');
        $input.parents('.tr').find('input').not($input).not('[readonly="readonly"]').each(function(){
            $(this).attr('readonly', 'readonly');
        });
    }
    else {
        // Wrong input provided
        return new Error(
            'Incorrect input string provied. \
            Not "valid" or "invalid"'
        );
    }
}

/**
 * 
 * @param {JQuery} $tr 
 */
function isRowValid($tr){
    $tr.children('input').each(function(){
        if($target.attr('data-valid', 'invalid')){
            return false;
        }
    });
    return true;
}

/**
 *
 */
function addReceiptRow(itemName, quantity, rowData){
    let $receiptRow = $('<div class="receipt-row flex-row"></div>');

    let aTotal = rowData.a,
        eTotal = rowData.e,
        mTotal = rowData.m,
        jTotal = rowData.j,
        lTotal = rowData.l;

    let quantityWidth = $('#receipt-header .receipt-quantity').width(); 
    let itemNameWidth = $('#receipt-header .item-name').width();
    let nameTotalWidth = $('#receipt-header .name-total:first-child').width();

    let $receiptHeaderContainer = $('<div class="receipt-header-container flex-row"></div>');
    $receiptHeaderContainer.append( $('<div class="receipt-quantity receipt-item"></div>').html(quantity).width(quantityWidth) );
    $receiptHeaderContainer.append( $('<div class="item-name receipt-item"></div>').html(itemName).width(itemNameWidth) );
    $receiptRow.append($receiptHeaderContainer);

    let $nameTotalContainer = $('<div class="name-total-container flex-row"></div>');
    $nameTotalContainer.append( $('<div class="name-total receipt-item"></div>').html('+$' + numToDollar(aTotal)).width(nameTotalWidth) );
    $nameTotalContainer.append( $('<div class="name-total receipt-item"></div>').html('+$' + numToDollar(eTotal)).width(nameTotalWidth) );
    $nameTotalContainer.append( $('<div class="name-total receipt-item"></div>').html('+$' + numToDollar(mTotal)).width(nameTotalWidth) );
    $nameTotalContainer.append( $('<div class="name-total receipt-item"></div>').html('+$' + numToDollar(jTotal)).width(nameTotalWidth) );
    $nameTotalContainer.append( $('<div class="name-total receipt-item"></div>').html('+$' + numToDollar(lTotal)).width(nameTotalWidth) );
    $receiptRow.append($nameTotalContainer);

    $('#receipt').append($receiptRow);
}