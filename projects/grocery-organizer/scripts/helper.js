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
    $('#receipt').children().not('b').each(function(){
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
    let absTotal = 0;
    let itemAmount = 0;

    // Split on "," OR ", " OR " " OR ", *"(any amount of spaces after ',')
    //var re = /,\s|,|\s|,\s*/; 

    $('#list-container .tr').each(function(){
        if( $(this).find('.item-cell input:first').val() ){
            // Get the elements
            let tmp = $(this).find('.who-cell input').val().toLowerCase();
            if(tmp === 'all'){
                tmp = 'a,e,j,l,m';
            }

            let newDataRow = {
                itemName: $(this).find('.item-cell input:first').val(),
                itemQuantity: $(this).find('.item-cell input:last').val(),
                unitPrice: $(this).find('.price-cell input').attr('data-unit-price'),
                totalPrice: $(this).find('.price-cell input').val(),
                who: $(this).find('.who-cell input').val().split(splitRE)
            };

            // Push the row elements directly into the dataList variable
            dataList.push(newDataRow);

            let rowReceipt = { a: '+$0.00', e: '+$0.00', j: '+$0.00', l: '+$0.00', m: '+$0.00' };

            absTotal += parseFloat(newDataRow.totalPrice);
            itemAmount += parseInt (newDataRow.itemQuantity);

            let priceEach = newDataRow.totalPrice / newDataRow.who.length;
            for(let person of newDataRow.who){
                // Split the price of who bought it and add it to each of their total 
                runningTotal[person] += priceEach;
                rowReceipt[person] = '+$' + getAsNearestCent(priceEach) + '';
            }

            /**
            * (1) Banana @ $2.00 (a,e,m): a:$9.36, ... 
            * 1 Banana $2.00 a:$9.36 || e:$2.01(+$1.00)
            */

            let quanitytStr = '(' + newDataRow.itemQuantity + ')';
            let fractionStr = '1/' + newDataRow.who.length;
            let receiptStr = quanitytStr + newDataRow.itemName  + 
                ' @ $' + getAsNearestCent( newDataRow.unitPrice ) + '($' + getAsNearestCent( newDataRow.totalPrice ) + ')' +
                ' (' + newDataRow.who.toString() + ') : ' + 
                'a:$' + getAsNearestCent(runningTotal.a) + rowReceipt.a +
                ', e:$' + getAsNearestCent(runningTotal.e) + rowReceipt.e +
                ', j:$' + getAsNearestCent(runningTotal.j) + rowReceipt.j +
                ', l:$' + getAsNearestCent(runningTotal.l) + rowReceipt.l +
                ', m:$' + getAsNearestCent(runningTotal.m) + rowReceipt.m;

            receiptStr = newDataRow.itemQuantity + ' ' + newDataRow.itemName  + 
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

    //console.log(dataList);
    //console.log(receiptList)

    return {
        dataList: dataList,
        receiptList: receiptList, 
        totals: runningTotal,
        absTotal: absTotal,
        itemAmount: itemAmount
    }
}

/**
 * 
 * @param {String | Number} value Amount as a string or number
 */
function getAsNearestCent(value){
    // nearest defaults to true
    value = value.toString();
    //console.log(parseFloat(value).toFixed(2));
    return parseFloat(value).toFixed(2);
}

function numToDollar(value){
    return getAsNearestCent(value);
}

function appendPersonTotal(name, totalStr){
    let elementStr = '<span><b>' + name + ':&nbsp;</b>$' + numToDollar(totalStr) + '</span>\n';
    // /console.log(elementStr)
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

    //console.log('Receipt as Text');
    //console.log(lines.join('\n'));

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
        $input.parents('.tr input[readonly="readonly"]').each(function(){
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