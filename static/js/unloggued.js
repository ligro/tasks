;(function($) {
    'use strict';

    $.App = {
        login : {
            success: function(){
                window.location.reload(true)
            },
            validate: function($form){
                var res = true;

                $form.find('textarea, input').each(function(index){
                    var $this = $(this)

                    if ($this.attr('name') !== ''
                        && $this.val() === ''
                    ) {
                        $this.errorMsg('can not be empty')
                        res = false;
                    }
                })

                return res;
            }
        },
        userCreation: {
            success: function(){
                window.location.reload(true)
            },
            validate: function($form){
                var res = true;

                $form.find('textarea, input').each(function(index){
                    var $this = $(this)

                    if ($this.attr('name') !== ''
                        && $this.val() === ''
                    ) {
                        $this.errorMsg('can not be empty')
                        res = false;
                    }
                })

                return res;
            }
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
