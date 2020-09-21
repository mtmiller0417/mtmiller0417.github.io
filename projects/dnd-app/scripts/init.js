/// <reference path="../../../global-resources/jquery-3.5.1.js" />
let universalHeadMin = window.screen.availWidth; // Start it at the max

function main(){
    /* Call after page loads to properly
    format header */
    //handleResize();
    
    setupMenuBtns();

    resize();

    $(window).on('resize', resize);//handleResize


    let c = new Class();
    //c.addSpell('spell','description');
    //c.addSpell('spell_2','description_2');
    //console.log( c.export() );
}

function resize(){
    let windowWidth = window.innerWidth;

    let $header = $('#main-header'),
        $tabContainer = $('#tab-container');

    // Min width of tab-container
    let CUTOFF2 = $tabContainer[0].scrollWidth; // 495
    // Min width of header by adding title(icon) scrollwidth
    let CUTOFF1 = CUTOFF2 + $('#title')[0].scrollWidth; // 556

    console.log('windowWidth:', windowWidth, ' CUTOFF1:', CUTOFF1, ' CUTOFF2:', CUTOFF2)

    // Make header flex-col?
    if(windowWidth < CUTOFF1){
        console.log('Make smaller...')
        $header.removeClass('f-box-row').addClass('f-box-col');
        $tabContainer.css({
            "margin-left" : "0",
        });
    } else {
        console.log('Make bigger...')
        $header.removeClass('f-box-col').addClass('f-box-row');
        $tabContainer.css({
            "margin-left" : "auto",
        });
    }

    // Make tab-container flex-col?
    if(windowWidth < CUTOFF2){
        console.log('Make EVEN smaller...')
        $tabContainer.removeClass('f-box-row').addClass('f-box-col');
    } else {
        console.log('Make EVEN bigger...')
        $tabContainer.removeClass('f-box-col').addClass('f-box-row');
    }
}

/**
 * 
 * 
 */
function handleResize(){
    let $header = $('#main-header'),
        $tabContainer = $('#tab-container');
    let flexboxRow = 'f-box-row',
        flexboxCol = 'f-box-col';

    // Set to overflow 
    /*$header.css({
        "overflow-x": "scroll",
        "width": "inherit"
    });*/
    /*$tabContainer.css({
        "overflow-x": "scroll",
        "width": "inherit"
    })*/

    let minWidth = $header[0].scrollWidth, // scrollWidth, offsetWidth?
        windowWidth = window.innerWidth; // window.screen.availWidth
    console.log($header[0].clientWidth)


    console.log('minWidth?: ', minWidth, '  windowWidth: ', windowWidth)
    //console.log('minContent: ', $header.css('width'));

    //let styles = getComputedStyle($header[0]);
    //console.log('computed width',styles.width);

    //console.log('minWidth?: ', universalHeadMin, '  windowWidth: ', window.innerWidth)

    if(universalHeadMin > window.innerWidth){ 
        universalHeadMin = minWidth; 
        console.log('univ min:', universalHeadMin);
    }

    if(minWidth >  window.innerWidth ){
        // make header smaller ( by 1 level, top down )
        console.log('Make smaller!')
        $header.removeClass(flexboxRow).addClass(flexboxCol);
        console.log('header',$header[0].classList);
    } else {
        // make header smaller ( by 1 level, bottom up )
        console.log('Make bigger!')
        $tabContainer.removeClass(flexboxCol).addClass(flexboxRow);
        console.log('header',$header[0].classList);
    }

    console.log()

    // Unnecessary?
    setAllWidthMax( $('#tab-container .tab-item') );
}

// setup functionality for .tab-item buttons
function setupMenuBtns(){
    $('.tab-item').on('click', function(event){
        let id = $(this).attr('data-for');
        toggleContent(id);
    });

    setAllWidthMax($('#tab-container .tab-item'));

    $('#title').trigger('click');
}

/**
 * 
 * @param {string} id 
 */
function toggleContent(id){
    // Create JQuery object from id
    let $content = $('#' + id);
    // Hide any class that IS visible( ISN'T hidden )
    $('.page-content').each(function(){
        if(!$(this).hasClass('hide')){
            $(this).addClass('hide');
        }
    });
    // Make the passed in element id visible
    $content.removeClass('hide');
}  

/**
 * Takes in a list of JQuery objects and sets the width of each
 * to the width of the largest one
 * @param {JQuery} $btnList 
 */
function setAllWidthMax($btnList){
    let maxWidth = 0, 
        width;
    $btnList.each(function(){
        width = $(this).width();
        if(width > maxWidth)
            maxWidth = width; 
    });

    $btnList.width(maxWidth);
}