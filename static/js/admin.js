;(function($) {
    'use strict';

    $.App = {
        getUserTasks: function(userId) {
            // fixme use jcolumns ?
            $.ajaxPromise({
                type: 'POST',
                url: '/admin/api/usertasks',
                data: {userId: userId}
            })
            .then(function(data){
                var $tasks = $('.tasks'),
                    tplData = {}

                $tasks.html('')
                for (var i in data.tasks) {
                    tplData = data.tasks[i]
                    tplData.nobuttons = 1
                    console.log(tplData)
                    // TODO make it Promise
                    $.ui._loadTpl('task', tplData, function(err, out) {
                        $tasks.append($(out))
                    })
                }
            })
            .catch(function(data){
                $(document.body).trigger('notify', ['An error occured', 'error']);
            })
        }
    }

    Zepto(function($){
        $('.jFormUser')
            .on('post:success', function (e, data) {
                var $users = $('.users');

                $users.html('')
                for (var i in data.users) {
                    $.ui._loadTpl('user', data.users[i], function(err, out) {
                        $users.append($(out))
                    })
                }
            })
            .on('post:error', function(e, data) {
                $(document.body).trigger('notify', ['An error occured', 'error']);
                console.log("error %o", data)
            })
            .post()

        $('.users').on('click', '.jGetUserTask', function(e){
            e.preventDefault()
            $.App.getUserTasks($(e.currentTarget).closest('.user').attr('data-id'))
        })
    })

})(Zepto)
