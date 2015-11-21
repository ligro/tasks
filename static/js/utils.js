;(function($) {
    'use strict';

    $.extend($, {
        ajaxPromise: function(data) {
            return new Promise(function (resolve, reject) {
                data.success = function (data) {
                    resolve(data)
                }
                data.error = function (xhr, type) {
                    reject({'xhr': xhr, 'type': type})
                }
                $.ajax(data)
            })
        }
    })

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
        post: function(data = {}){
            return this.each(function(){
                var $this = $(this)

                $this.find('.form-group').removeClass('has-error')
                $this.find('.jErrorMsg').remove()

                if (typeof $.App[$this.data('method')] !== 'undefined'
                    && typeof $.App[$this.data('method')].validate !== 'undefined'
                ) {
                    if (!$.App[$this.data('method')].validate($this)) {
                        return
                    }
                }

                $.extend(data, $this.getFields())
                $.ajaxPromise({
                    type: $this.attr('method'),
                    url: $this.attr('action'),
                    data: data
                })
                .then(function(data){
                    // data.success is mandatory for POST requests but not for others
                    if ($this.attr('method') != 'POST' || data.success) {
                        if (typeof $.App[$this.data('method')] !== 'undefined'
                            && typeof $.App[$this.data('method')].success !== 'undefined'
                        ) {
                            $.App[$this.data('method')].success(data)
                        }
                        $this.trigger('post:success', data)

                    } else if (typeof data.msgs === "undefined") {
                        $(document.body).trigger('notify', ['An error occured', 'error']);
                        $this.trigger('post:error')
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
                        $this.trigger('post:error', data)
                    }
                })
                .catch(function(data){
                    if (data.xhr.status != 403) {
                        $(document.body).trigger('notify', ['An error occured', 'error']);
                        $this.trigger('post:error')
                    }
                })
            })
        },
        errorMsg: function(msg) {
            return this.each(function(){
                $(this)
                    .after('<span class="jErrorMsg help-block">'+msg+'</span>')
                    .closest('.form-group').addClass('has-error')
            })
        },
    })

    Zepto(function($){
        $(document).on('ajaxError', function(e){
            if (e.data[0].status == 403) {
                // you should login
                $('<form action="/auth/login/" method="POST" class="jForm" data-method="login">')
                    .on('post:success', function (e){
                        e.target.remove()
                    })
                    .modal('login', {}, {
                        title: 'Log in',
                        submit: {name: 'Log in', class: 'btn-primary'}
                    })
            }
        })
    })

})(Zepto)
