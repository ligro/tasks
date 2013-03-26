;(function($) {
    'use strict';

    Zepto(function($){
        $('form.jForm a.jSubmit').on('click', function(){
            $(this).closest('form.jForm').submit()
        })
        $('form.jForm').on('submit', function(){
            $(this).post()
        })
    })
})(Zepto)
