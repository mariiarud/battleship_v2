//Install express server
const express = require('express'),
    app = module.exports.app = express();
const path = require('path');
// const Http = require("http").Server(express);
// var http = require('http');

// const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/client'));

app.get('/*', function(req, res) {
res.sendFile(path.join(__dirname,'/dist/client/index.html'));
});

// Start the app by listening on the default Heroku port
const server = app.listen(process.env.PORT || 8080);

const Socketio = require("socket.io")(server);
// const Socketio = require("socket.io").listen(server);

class Player {
    constructor(id) {
      this.id = id;
      this.score = 20;
      this.isOnline = true;
      this.isReady = false;
      this.myBoard = [];
      for (var i = 0; i < 10; i++){
        this.myBoard[i] = [];
            for (var j = 0; j < 10; j++){
                this.myBoard[i][j] = 0;
        }}
        
    }
  }

class Room {
    constructor(id) {
        this.id = id;
        this.players = new Map();
      }
}

var rooms = [new Room(0), new Room(1), new Room(2)];
let playersOnline = 0;
let playersChecked = 0;

Socketio.on("connection", socket => {
    playersOnline++;
    Socketio.emit("roomStatus", [rooms[0].players.size, rooms[1].players.size, rooms[2].players.size]);
    socket.on("joinRoom", i=>{
        
        if(rooms[i].players.size<2){
            var player = new Player(socket.id);
            rooms[i].players.set(player.id, player);
            socket.emit("newPlayer", player.id, i);
            Socketio.emit("roomStatus", [rooms[0].players.size, rooms[1].players.size, rooms[2].players.size]);
        }
        else{
            socket.emit("roomIsFull");
        }
    });
    socket.on('iAmGuest', ()=> {
        playersChecked++;
        if(playersChecked==playersOnline){
            rooms.forEach(function(room) {
            room.players.forEach(function(player){
                if(!player.isOnline){
                    Socketio.emit("playerLeave", room.id);
                    room.players.clear();
                }
                });
            });
        Socketio.emit("roomStatus", [rooms[0].players.size, rooms[1].players.size, rooms[2].players.size]);
        }
    });
    socket.on('iAmHere', (playerId, room)=> {
        let player = rooms[room].players.get(playerId);
        player.isOnline = true;
        playersChecked++;
        // console.log("Player "+playerId+"\n in room: "+room +"\n  is omline:"+ rooms[room].players.get(playerId).isOnline);
        // console.log("Players online "+playersOnline+"\n playersChecked: "+playersChecked +"\n ");
        if(playersChecked==playersOnline){
            rooms.forEach(function(room) {
            room.players.forEach(function(player){
                if(!player.isOnline){
                    Socketio.emit("playerLeave", room.id);
                    room.players.clear();
                }
                });
            });
        Socketio.emit("roomStatus", [rooms[0].players.size, rooms[1].players.size, rooms[2].players.size]);
        }
    });

    socket.on("startGame", (room, playerId, board)=>{
        let isReady = false;
        
        rooms[room].players.forEach(function(player){
            if(player.id == playerId){
                player.myBoard = board;
                player.isReady = true;
            }
            else{
                isReady = player.isReady && player.isOnline;
            }
        });
        if (isReady){
            rooms[room].players.forEach(function(player){
                Socketio.to(player.id).emit("startNewGame");
            });
        }
        else socket.emit("waiting");
    });

    socket.on("getBoards", (playerId, room) => {
        rooms[room].players.forEach(function(player){
            if(player.id == playerId){
                socket.emit("myBoard", player.myBoard);
            }
            else{
                socket.emit("enemyBoard", player.myBoard);
            }
        });
        
        // console.log(Array.from(rooms[room].players.values())[0]);
        if(Array.from(rooms[room].players.values())[0].id == playerId)
            socket.emit("isTurn", true);
        else
            socket.emit("isTurn", false);
    });

    socket.on("goodShot", (room, playerId, board)=>{
        let score = 1;
        rooms[room].players.forEach(function(player){
            if(player.id != playerId){
                player.myBoard = board;
                score = --player.score;
                Socketio.to(player.id).emit("renewBoard", board);
            }
        });
        if(score==0){
            rooms[room].players.forEach(function(player){
                if(player.id != playerId){
                    Socketio.to(player.id).emit('lose');
                }
                else 
                    Socketio.to(player.id).emit('win');
            });

            rooms[room].players.clear();
        }
        
    });

    socket.on("missShot", (room, playerId, board)=>{
        rooms[room].players.forEach(function(player){
            if(player.id != playerId){
                player.myBoard = board;
                Socketio.to(player.id).emit("renewBoard", board);
            }
        });
    });

    socket.on("changeTurn", room =>{
        Socketio.emit("turn", room);
    });

    socket.on('disconnect', ()=> {
        Socketio.emit("callReset");
        playersOnline--;
        playersChecked = 0;
        rooms.forEach(function(room) {
            // console.log("Check room:" +room.id);
            room.players.forEach(function(player){
                player.isOnline = false;
                Socketio.emit("rollCall", player.id);
            });
        });
    });
});

