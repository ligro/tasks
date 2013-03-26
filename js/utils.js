;(function($) {
    'use strict';

    $.extend($.fn, {
        // get fields of a form
        getFields: function(){
            var fields = {}

            $(this).find('input, textarea').each(function(index, element){
                var $this = $(this)

                $this.val() !== ''
                    && (fields[$this.attr('name')] = $this.val())
            })

            return fields
        },
        // post form
        post: function(){
            $.ajax({
                type: 'POST',
                url: this.data('url'),
                data: this.getFields(),
                success: function(data){
                    if (data.success) {
                        console.log(data)
                    } else {
                        console.log(data)
                        //.displayError(data.error);
                    }
                },
                error: function(xhr, type){
                    //.displayError('An error occured');
                }
            })
        }
    })
})(Zepto)
