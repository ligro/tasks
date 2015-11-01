;(function($) {
    'use strict';

    $.extend($.fn, {
        select: function(options, selectedValue = null){
            return this.each(function (){
                var $this = $(this),
                    $dropDown = $this.find('.jSelectDropDown'),
                    $value = $this.find('.jSelectValue'),
                    first = true

                for (var value in options) {
                    if (first) {
                        $value.html(options[value]).data('value', value)
                        first = false
                    }
                    $dropDown.append('<div data-value="' + value + '">' + options[value] + '</div>')
                }

                $this.on('click', function (e) {
                    e.preventDefault()
                    $dropDown.toggle()
                })
                $this.on('click', '.jSelectDropDown div', function (e) {
                    e.preventDefault()
                    var $self = $(e.target)
                    $value.html($self.html()).data('value', $self.data('value'))
                    $dropDown.toggle()
                    $this.trigger('select:change', [$self.data('value')])
                })
            })
        }
    })

})(Zepto)

