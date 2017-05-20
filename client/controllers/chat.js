module.exports = function ($scope, $timeout) {

    var socket = require("../websockets/sockets")();

    $scope.send = function(msg)
    {
        socket.emit('chat message', msg);
    };

    $scope.player = {id: Math.random()*10000, x: 670, y: 465, opacity: 1};
    $scope.players = [$scope.player];

    $scope.messages = [];
    // $scope.offsetX = 0;
    // $scope.offsetY = 0;


    socket.on('chat message', function (msg) {
        $scope.messages.push({name: msg});
        $scope.$digest();
    });

    //ЧАТ
    $scope.usersTyping = [];
    $scope.name = "";
    $scope.message = "";
    $scope.messages = [];
    $scope.opoveshenie = "";
    $scope.typing = false;
    $scope.dataall = [];
    var to;

    socket.on('Data', function (msg)
    {
        console.log("msg",msg);
        $scope.messages = msg;
        $scope.$digest();
    });

    socket.on('chat message', function (msg)
    {
        $scope.messages.push(msg);
        $scope.$digest();
    });


    socket.on('nik message', function (msg) {

        $scope.usersTyping.push(msg);
        $scope.typing = true;
        to = $timeout(function () {
            var index = $scope.usersTyping.indexOf(msg);
            if (index != -1) $scope.usersTyping.splice(index, 1);
            $scope.typing = false;
        }, 5000);
        $scope.$digest();

    });

    $scope.Send = function () {
        $scope.data = $scope.name + ":" + $scope.message;
        socket.emit('chat message', {text: $scope.data});
        $scope.message = "";//приписываем имя к сообщению и посылаем
    };


    function stoppedTyping() {
        to = null;
        $scope.typing = false;
    };

    $scope.isTyping = function () {
        if (to) {
            $timeout.cancel(to);
            to = null;
        }
        $scope.typing = true;
        to = $timeout(stoppedTyping, 500);
        socket.emit('nik message', $scope.name);

    };
}