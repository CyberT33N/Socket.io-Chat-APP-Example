import {Msg} from '/js/socket/Msg.mjs';
import {User} from '/js/socket/User.mjs';
import {Room} from '/js/socket/Room.mjs';

export default {
  // ---- Msg ----
  sendMessage: (clientToken, roomDetails, AMPM, dateFull)=>{
    return new Msg().sendMessage(clientToken, roomDetails, AMPM, dateFull);
  },
  socketMSG: ()=>{
    return new Msg().socketMSG();
  },


  // ---- User ----
  friendClick: ()=>{
    return new User().friendClick();
  },


  // ---- Room ----
  connectRoom: ()=>{
    return new Room().connectRoom();
  },
  getRoomDetails: ()=>{
    return new Room().getRoomDetails();
  },
};
