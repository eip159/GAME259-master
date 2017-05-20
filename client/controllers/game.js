module.exports = function ($scope, $timeout) {

    var socket = require("../websockets/sockets")();

    $scope.player = {id: Math.random()*10000, x: 670, y: 465, opacity: 1};
    $scope.players = [$scope.player];


    var animate = function ()
    {

        var x2 = 400;
        var y2 = 400;

        var x = $scope.player.x - x2;
        var y = $scope.player.y - y2;

        var r = Math.sqrt(x*x + y*y);
        var a = Math.atan(y / x);

        $scope.player.x = Math.cos(a)*(r-1) + x2;
        $scope.player.y = Math.sin(a)*(r-1) + y2;

        $scope.players.push( {x: $scope.player.x, y: $scope.player.y, opacity: 1});

        $scope.players = _.chain($scope.players)
            .map(   function    (plr) { plr.opacity-=0.01; return plr; } )
            .filter(function    (plr) { return plr.opacity > 0 } )
            .value();

        $timeout(animate, 10);
    };
    //animate();


    $scope.StopMoving = function (x,y)
    {
        $scope.offsetX = x;
        $scope.offsetY = y;
    };

    $scope.StartMoving = function (x,y)
    {
        $scope.offsetX = x;
        $scope.offsetY = y;

    };



    $scope.SelfMoving = function ()
    {
        if ($scope.offsetX === undefined)
        {
            $timeout($scope.SelfMoving, 200);
            return;
        }
        //$scope.offsetX = x2;
        //$scope.offsetY = y2;

        var x = $scope.player.x - $scope.offsetX;
        var y = $scope.player.y - $scope.offsetY;

        var r = Math.sqrt(x*x + y*y);

        if (r>=5)
        {
            var a = Math.atan(y / x);
            if ($scope.offsetX > $scope.player.x) a += Math.PI;

            $scope.player.x = Math.cos(a)*(r-8) + $scope.offsetX;
            $scope.player.y = Math.sin(a)*(r-8) + $scope.offsetY;

            $timeout($scope.SelfMoving, 35);  // скорость Меньше - быстрее
        }
        else
        {
            $timeout($scope.SelfMoving, 200);
        }

        socket.emit("player", {id: $scope.player.id,  //Сетевик.
            x: $scope.player.x,
            y: $scope.player.y});


    };

    //$scope.SelfMoving();


    socket.on("player", function (plr) {
        var player = _.find($scope.players, function(x) { return x.id==plr.id; });
        if (player && player.id == $scope.player.id) return;
        if (player)
        {
            player.x = plr.x;
            player.y = plr.y;
        }
        else
        {
            $scope.players.push(plr);
        }
        $scope.$digest();
    });

};