;(function($) {
    'use strict';

    $.projects = {
        element: {},
        _default: 'default',
        current: undefined,
        init: function(){
            $.projects.element = $('#projects')

            $(document).on('project:select', function(e, element, project){
                if (project == $.projects.current) {
                    $(document.body).trigger('notify', ['Project already selected', 'info'])
                } else {
                    $.projects.element.find('.label-info').removeClass('label-info')
                    element.find('.label').toggleClass('label-info')
                    $.projects.current = element.data('project')
                    $(document.body).trigger('task:refresh')
                }
            })

            $(document).on('click', '.jProjectSelect', function(e){
                var $this = $(this)

                e.preventDefault()
                $(document.body).trigger('project:select', [$this, $this.data('project')])
            })

            $(document).on('project:add', function(e, project){
                $.ui._loadTpl('project', {project: project}, function(err, out) {
                    $.projects.element.append(out)
                })
            })

            $(document).one('task:load', function(e){
                // add default project
                $.ui._loadTpl('project', {project: $.projects._default}, function(err, out) {
                    $.projects.element.append(out)
                    var el = $.projects.element.find('.jProjectSelect[data-project="'+$.projects._default+'"]')
                    $(document.body).trigger('project:select', [el, $.projects._default])
                })
            })
        }
    }

    Zepto(function($) {
        $.projects.init();
    })

})(Zepto)
