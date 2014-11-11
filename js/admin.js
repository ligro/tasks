;(function($) {
    'use strict';

    $.App = {
    }

    Zepto(function($){
        $('.jForm')
            .on('post:success', function (e, data) {
                console.log("success %o", data)
                console.log(data)
                var users = $('.users');

                $users.html('')
                for (i in data) {
                    // TODO
                }
            })
            .on('post:error', function(e, data) {
                console.log("error %o", data)
            })
            .post()
    })

})(Zepto)
