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

            return this.each(function(){
                var $this = $(this)

                $this.find('.control-group').removeClass('error')
                $this.find('.jErrorMsg').remove()

                $.ajax({
                    type: $this.attr('method'),
                    url: $this.data('url'),
                    data: $this.getFields(),
                    success: function(data){
                        if (data.success) {
                            $.App[$this.data('success')]()

                        } else if (typeof data.msgs === "undefined") {
                            $(document.body).trigger('notify', ['An error occured', 'error']);
                        } else {
                            var $input, field;
                            for (field in data.msgs) {
                                $input = $this.find('input[name="'+field+'"]')
                                if ($input.length == 0) {
                                    $(document.body).trigger('notify', [data.msgs[field], 'error']);
                                    continue;
                                }
                                $input.errorMsg(data.msgs[field])
                            }
                        }
                    },
                    error: function(xhr, type){
                        $(document.body).trigger('notify', ['An error occured', 'error']);
                    }
                })
            })
        },
        errorMsg: function(msg) {
            return this.each(function(){
                $(this)
                    .after('<span class="jErrorMsg help-inline">'+msg+'</span>')
                    .closest('.control-group').addClass('error')
            })
        }
    })
})(Zepto)
