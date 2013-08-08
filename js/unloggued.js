;(function($) {
    'use strict';

    $.App = {
        login : function(){
            window.location.reload(true)
        },
        userCreation : function(){
            window.location.reload(true)
        }
    }

    Zepto(function($){
        // display about
        $(document).on('click', '.jLink', function(){
            $('<div>')
                .modal('abouts', {}, {title: 'Abouts'})
        })
    })
})(Zepto)
