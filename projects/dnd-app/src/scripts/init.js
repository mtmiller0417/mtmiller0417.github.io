function main(){
    console.log('document loaded');
    
    setupMenuBtns();

    let c = new Class();
    //c.addSpell('spell','description');
    //c.addSpell('spell_2','description_2');
    //console.log( c.export() );
}

// setup functionality for .tab-item buttons
function setupMenuBtns(){
    $('.tab-item').on('click', function(event){
        let id = $(this).attr('data-content-id');
        toggleContent( $('#' + id) );
    });

    $('#title').click();
}

// Make the given element visible and hide all others
function toggleContent($pageContent){
    $pageContent.removeClass('hide');
    //console.log('elements to hide:', $('.page-content').not($pageContent[0]));
    $('.page-content').not($pageContent[0]).addClass('hide');
}
