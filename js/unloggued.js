;(function($) {
    'use strict';

    $.App = {
        login : function(){
            window.location.reload(true)
        },
        userCreation : function(){
            console.log('userCreation')
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