'use strict'


        const log = require('fancy-log'),
   chalkAnimation = require('chalk-animation'),
         gradient = require('gradient-string'),
            chalk = require('chalk'),

controllermongodb = require('../controller/controller-mongodb');






const socketio = {

      rootConnect: async function(http) { return await rootConnect(http); }

};

module.exports = socketio;









async function rootConnect(http){
log( 'rootConnect();' );

      const io = require('socket.io')(http);

      io.on('connection', (socket) => {
      log('User connected..');

           // connect client to room
           connectChat(socket);

           // catch message from Chat Room
           messageRoom(socket)

           // Check when user disconnect from website
           disconnectUser(socket);

           // Create event to catch room id, fetch room details and send back to client
           getRoomDetails(socket);


      }); // io.on('connection', (socket) => {

} // function rootConnect(){














function connectChat(socket){
//log( 'connectChat()' );

      // we recieve user token & room name
      socket.on('chat connect', (msg) => {(async () => {
      log('connectChat() - message: ' + JSON.stringify(msg, null, 4));

             const UserDetails = await controllermongodb.getUserDetails(msg.usertoken);
             if( UserDetails ) {
             log('connectChat() - UserDetails was found..');

               socket.emit('connectChat success', UserDetails[0]);
               connectRoom(socket);

             } // if( UserDetails ) {
             else socket.emit('connectChat error', "Can not find User Token in Database");

        })().catch((e) => {  console.log('ASYNC - chat connect Error:' +  e )  })});

} // function connectChat(){























function getRoomDetails(socket){
//log( 'connectChat()' );

      // we recieve user token & room name
      socket.on('chat getRoomDetails', (roomID) => {(async () => {
      log('getRoomDetails() - roomID: ' + roomID);

             socket.emit('chat getRoomDetails success', await controllermongodb.getRoomDetails(roomID));

      })().catch((e) => {  console.log('ASYNC - chat getRoomDetails Error:' +  e )  })});

} // function getRoomDetails(){






function connectRoom(socket){
log( 'connectRoom();' );

  socket.on('room connect', (roomID) => {(async () => {
  log('connectRoom() - roomID: ' + JSON.stringify(roomID, null, 4));


         const r = await controllermongodb.getRoomDetails(roomID);
         if(r){
         log( 'getRoomDetails() success - result: ' + JSON.stringify(r, null, 4) );

            socket.join(roomID);
            socket.emit('connectRoom success', r[0]);

         } //  if(r){
         else socket.emit('connectChat error', {"msg":"Can not find Room ID in Database"});


    })().catch((e) => {  console.log('ASYNC - onnectRoom Error:' +  e )  })});


} //function connectRoom(socket){





function messageRoom(socket){
//log( 'messageRoom()' );

      // {"msg": msg, "room": details.room, "usertoken": details.usertoken}
      socket.on('chat message', (msg) => {(async () => {
      log('messageRoom() - chat message - message: ' + JSON.stringify(msg, null, 4));

             const r = await controllermongodb.storeMessages(msg);
             socket.to(msg.room).emit('msg', msg.msg);

      })().catch((e) => {  console.log('ASYNC - chat message Error:' +  e )  })});

} // function messageRoom(socket){

















function disconnectUser(socket){
//log( 'disconnectUser()' );

      socket.on('disconnect', () => {
             log('disconnectUser() - User disconnected');
      });

} // function disconnectUser(socket){
