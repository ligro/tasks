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
        post: function(success){
            var $this = this
            $.ajax({
                type: 'POST',
                url: this.data('url'),
                data: this.getFields(),
                success: function(data){
                    if (data.success) {
                        console.log(data)
                        $.App[$this.data('success')]()
                    } else {
                        console.log(data)
                        $this.displayError(data.error);
                    }
                },
                error: function(xhr, type){
                    //.displayError('An error occured');
                }
            })
        },
        displayError: function(error){
            console.log(error)
        }
    })
})(Zepto)
