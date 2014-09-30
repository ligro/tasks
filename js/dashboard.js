;(function($) {
    'use strict';

    var dashboards = {
        $el: null,
        current: null,
        add: function(id, name) {
            dashboards.$el.append('<option value="' + id + '">' + name + '</option>')
        },
        select: function(id) {
            console.log("select %s", id);
            if (dashboards.current != id) {
                dashboards.current = id
                $(document.body).trigger('dashboard:change', [dashboards.current])
                window.localStorage.setItem('dashboardId', dashboards.current)
            }
        }
    }

    Zepto(function($){
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
                    var defaultDashboardId = false

                    for (var dashboardId in data) {
                        !defaultDashboardId && (defaultDashboardId = dashboardId)
                        dashboards.add(dashboardId, data[dashboardId].name)
                    }
                    dashboards.add("", "All my tasks")
                    dashboards.add("add", "Add a new dashboard")

                    dashboards.$el.on('change', function (e) {
                        if (dashboards.$el.val() == 'add') {
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
                            dashboards.select(dashboards.$el.val())
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
    })

})(Zepto)
