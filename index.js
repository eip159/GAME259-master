var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require("underscore");

app.use(express.static('public'));

// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });
//
// app.get('/app.js', function(req, res){
//   res.sendfile('app.js');
// });

var players = {};

function Distance(o1, o2) {
  return Math.sqrt(Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2) );
}
// socket.on - приём сообщения
// io.emit - отправка сообщения
io.on('connection', function(socket){

  //io.emit('players', players);
  socket.on('chat message', function (msg) {
    //data.push(msg);
    io.emit('chat message', msg);
  });
  socket.on('nik message', function (msg) {
    io.emit('nik message', msg);
  });

  socket.on("player", function (player) {
    //console.log("player",player);
    //players.push(player);
    players[player.id] = player;
    var keys = _.keys(players);
    for(var i=0;i<keys.length-1;i++)
      for(var j=i+1;j<keys.length;j++)
      {
        var plr1 = players[keys[i]];
        var plr2 = players[keys[j]];
        var center1 = {x: plr1.x + plr1.size/2, y:plr1.y + plr1.size/2};
        var center2 = {x: plr1.x + plr2.size/2, y:plr2.y + plr2.size/2};
        var dist = Distance(center1, center2);
        var sumRadius = plr1.size/2+plr2.size/2;
        if (dist <  sumRadius)
        {
          var diff = Math.round(sumRadius - dist);
          if ( diff > 0) {
            console.log("diff", diff);
            if (plr1.size > plr2.size) {
              plr1.size += diff;
              plr2.size -= diff;
            }
            else {
              plr2.size += diff;
              plr1.size -= diff;
            }
            io.emit('player', plr1);
            io.emit('player', plr2);
            return;
          }

        }
      }



    io.emit('player', player);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
