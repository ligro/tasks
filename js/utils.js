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
        post: function(){
            return this.each(function(){
                var $this = $(this)

                $this.find('.control-group').removeClass('error')
                $this.find('.jErrorMsg').remove()

                if (typeof $.App[$this.data('method')] !== 'undefined'
                    && typeof $.App[$this.data('method')].validate !== 'undefined'
                ) {
                    if (!$.App[$this.data('method')].validate($this)) {
                        return
                    }
                }

                $.ajax({
                    type: $this.attr('method'),
                    url: $this.attr('action'),
                    data: $this.getFields(),
                    success: function(data){
                        // data.success is mandatory for POST requests but not for others
                        if ($this.attr('method') != 'POST' || data.success) {
                            if (typeof $.App[$this.data('method')] !== 'undefined'
                                && typeof $.App[$this.data('method')].success !== 'undefined'
                            ) {
                                $.App[$this.data('method')].success(data)
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
