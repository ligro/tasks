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
        $('form.jForm a.jSubmit').on('click', function(){
            $(this).closest('form.jForm').submit()
        })
        $('form.jForm').on('submit', function(){
            $(this).post()
        })
    })
})(Zepto)
