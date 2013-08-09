;(function($) {
    'use strict';

    $.extend($.fn, {
        // get fields of a form
        getFields: function(){
            var fields = {}

            $(this).find('input, textarea').each(function(index, element){
                var $this = $(this)

                $this.attr('name') != ''
                    && (fields[$this.attr('name')] = $this.val())
            })

            return fields
        },
        // post form
        post: function(success){
            var $this = this

            // clear
            $this.find('.jErrorMsg').remove();
            $this.find('.control-group').removeClass('error');

            if (typeof $.App[$this.data('method')] !== 'undefined'
                && typeof $.App[$this.data('method')].validate !== 'undefined'
            ) {
                if (!$.App[$this.data('method')].validate($this)) {
                    return
                }
            }

            $.ajax({
                type: 'POST',
                url: this.attr('action'),
                data: this.getFields(),
                success: function(data){
                    if (data.success) {
                        if (typeof $.App[$this.data('method')] !== 'undefined'
                            && typeof $.App[$this.data('method')].success !== 'undefined'
                        ) {
                            $.App[$this.data('method')].success()
                        }

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
        },
        errorMsg: function(msg) {
            $(this)
                .after('<span class="jErrorMsg help-inline">'+msg+'</span>')
                .closest('.control-group').addClass('error')
        }
    })
})(Zepto)
