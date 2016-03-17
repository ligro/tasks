;(function($) {
    'use strict';

    // TODO rename as dropdown
    $.extend($.fn, {
        select: function(options, selectedValue, inputName){
            if (typeof selectedValue === 'undefined') selectedValue = null
            return this.each(function (){
                var $this = $(this),
                    tplData = {},
                    $dropDown,
                    $values,
                    $value,
                    $input

                tplData.selectedValue = selectedValue
                if (inputName) {
                    tplData.input = {
                        'name' : inputName,
                        'value': null
                    }
                }

                tplData.options = []
                for (var id in options) {
                    if (tplData.selectedValue == null) {
                        tplData.selectedValue = options[id]
                    }
                    if (tplData.input && tplData.selectedValue == options[id]) {
                        tplData.input.value = id
                    }
                    tplData.options.push({id: id, value: options[id]})
                }

                $.ui._loadTplPromise('dropdown', tplData)
                    .then(function(out) {

                        $this.append($(out));
                        $dropDown = $this.find('.dropdown')
                        $value = $this.find('.selectedValue')
                        $input = $this.find('input')

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
                            if ($input) {
                                $input.val($self.data('id'))
                            }

                            $dropDown.removeClass('open')
                            $this.trigger('select:change', [$self.data('id')])
                        })
                    })
            })
        }
    })

})(Zepto)

