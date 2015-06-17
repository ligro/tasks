;(function($) {
    'use strict';

    var dashboards = {
        $el: null,
        current: null,
        select: function(id) {
            if (dashboards.current != id) {
                dashboards.current = id
                $(document.body).trigger('dashboard:change', [dashboards.current])
                window.localStorage.setItem('dashboardId', dashboards.current)
            }
        },
        init: function() {
            dashboards.$el = $('.jDashboard')

            $(document).one('templates:load', function(e){
                $.ajax({
                    type: 'GET',
                    url: '/dashboards',
                    success: function(data){
                        if (data.length == 0) {
                            $('#FatalError').show()
                            return
                        }
                        var defaultDashboardId = false,
                            options = {}

                        for (var dashboardId in data) {
                            !defaultDashboardId && (defaultDashboardId = dashboardId)
                            options[dashboardId] = data[dashboardId].name
                        }
                        options[""] = "All my tasks"
                        options["add"] = "Add a new dashboard"

                        dashboards.$el.select(options)

                        dashboards.$el.on('select:change', function (e, id) {
                            console.log('select:change', id)
                            if (id == 'add') {
                                // launch modal to add a new dashboard
                                $('<form class="jForm" action="/dashboard/add" method="POST">')
                                    .on('post:success', function (e, data){
                                        // FIXME doesn't work
                                        dashboards.$el.val(data.datas.id)
                                            dashboards.select(data.datas.id)
                                            $.modal.closeModal()
                                    })
                                .modal('addDashboard', {}, {
                                    title: 'Dashboard',
                                    submit: {name: 'Add', class: 'btn-primary'}
                                })

                            } else {
                                dashboards.select(id)
                            }
                        })

                        var currentDashboardId = window.localStorage.getItem('dashboardId')
                        if (!currentDashboardId) {
                            currentDashboardId = defaultDashboardId
                        }
                        dashboards.$el.val(currentDashboardId)
                        dashboards.select(currentDashboardId)
                    },
                    error: function(xhr, type){
                        $('#FatalError').show()
                    }
                })
            })
        }
    }

    Zepto(function($){
        dashboards.init()
    })

})(Zepto)
