;(function($) {
    'use strict';

    // TODO rename as dropdown
    $.extend($.fn, {
        select: function(options, selectedValue = null){
            return this.each(function (){
                var $this = $(this),
                    tplData = {},
                    $dropDown,
                    $values,
                    $value

                tplData.selectedValue = selectedValue

                tplData.options = []
                for (var id in options) {
                    if (tplData.selectedValue == null) {
                        tplData.selectedValue = options[id]
                    }
                    tplData.options.push({id: id, value: options[id]})
                }

                $.ui._loadTpl('dropdown', tplData, function(err, out) {

                    $this.append($(out));
                    $dropDown = $this.find('.dropdown')
                    $value = $this.find('.selectedValue')

                    $this.on('click', function (e) {
                        e.preventDefault()
                        if ($dropDown.hasClass('open')) {
                            $dropDown.removeClass('open')
                        } else {
                            $dropDown.addClass('open')
                        }
                    })

                    $this.on('click', '.dropdown-menu li', function (e) {
                        e.preventDefault()
                        var $self = $(e.target)

                        $value.html($self.html())

                        $dropDown.removeClass('open')
                        $this.trigger('select:change', [$self.data('id')])
                    })
                })
            })
        }
    })

})(Zepto)

