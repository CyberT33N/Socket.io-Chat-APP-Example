/*################ config.json ################*/
import fs from 'fs';
import yaml from 'js-yaml';

/*################ Controller ################*/
import controller from '../../controller/socketio.mjs';
import controllerbot from '../../controller/bot.mjs';
import controllerMongoDB from '../../controller/mongodb.mjs';

/*################ Logs ################*/
import log from 'fancy-log';
import chalkAnimation from 'chalk-animation';
import gradient from 'gradient-string';
import chalk from 'chalk';





export const details = async pptr=>{ log('--- details() ----');
  await pptr.page.exposeFunction('details', async()=>{ log('--- EXPOSE - details ----');
    const config = new Config();
    return {
      testRoomDetails: await controllerMongoDB.getRoomDetails(config.test_room),
      testUserDetails: await controllerMongoDB.getUserDetails(config.test_client1.token)
    };
  }); // await pptr.page.exposeFunction('details', async()=>{
}; // export const details = async pptr=>{







export class Config{

  constructor(){
    this.get();
  }; // constructor(){


  get(){ log('class Config - get()');
      const json_config = yaml.safeLoad(fs.readFileSync('./admin/config.yml', 'utf8'));
      this.test_client1 = json_config.test.user[0];
      this.test_client2 = json_config.test.user[1];
         this.test_room = json_config.test.room;

           this.devHost = json_config.test.host + ':' + json_config.test.port;

           this.devLink = this.devHost + '/?usertoken=' + this.test_client1.token;
    this.devLinkPartner = this.devHost + '/?usertoken=' + this.test_client2.token;
  }; // async get(){


  async export(pptr){ log('class Config - expose()');
    await pptr.page.exposeFunction('config', ()=>{ log('--- EXPOSE - config() ----');
        return yaml.safeLoad(fs.readFileSync('./admin/config.yml', 'utf8'));
    }); // await pptr.page.exposeFunction('config', ()=>{
  }; // async export(pptr){

}; // export class Config{











export class CheckDOM{

  constructor(){
    this.config = new Config();
  }; // constructor(){

  async urlParameter(pptr){ log('checkURLParameter()');
    await pptr.page.exposeFunction('checkURLParameter', async script =>{ log('--- EXPOSE - checkURLParameter - script: ' + script + '---');

      const newTab = await controllerbot.openLinkNewTab(pptr.client, this.config.devHost + '/?usertoken=');

      // execute script inside of DOM by creating new function and run it
      return await newTab.evaluate(async script=>{
        var f = new Function('return ' + script)();
        return f();
      }, script); // const d = await newTab.evaluate(async script=>{

    }); // await pptr.page.exposeFunction('checkURLParameter', ()=>{
  }; // async checkURLParameter(pptr){


  async partnerMessage(pptr){ log('checkPartnerMessage()');
    await pptr.page.exposeFunction('checkPartnerMessage', async link =>{ log('--- EXPOSE - checkPartnerMessage ----');

      // do not delete timeout - We will wait here until animation is ready
      const newTab = await controllerbot.openLinkNewTab(pptr.client, this.config.devLinkPartner, 2000);

      // check if message was recieved at partner
      return await newTab.evaluate(msg=>{
        const lastElement = document.querySelector('.chat div:last-child');
        if(lastElement.textContent == msg &&
        lastElement.getAttribute('class') == 'bubble you' ) return true;
      }, 'sample_message123');

    }); // await pptr.page.exposeFunction('checkPartnerMessage', async link =>{
  }; // async checkPartnerMessage(pptr){

}; // class CheckDOM extends CheckDOMLib{














class ListenerEvents{


  async chatMessage(){ log('listenerChatMessage()');
    await this.pptr.page.exposeFunction('listenerChatMessage', async ()=>{ log('EXPOSE - listenerChatMessage()');

      const newTab = await controllerbot.newTab(this.pptr.client);
      const [msg] = await Promise.all([
        this.createSocketListener('chat message', await this.createDevSocket(newTab, this.devIO)),
        await controllerbot.typeText(newTab, 'textarea', 'sample_message123', 10),
        await controllerbot.click('.write-link.send', newTab, 1000)
      ]); return msg;

    }); // await this.pptr.page.exposeFunction('listenerChatMessage', async ()=>{
  }; // async listenerChatMessage(){


  async roomConnect(){ log('listenerRoomConnect()');
    await this.pptr.page.exposeFunction('listenerRoomConnect', async ()=>{ log('EXPOSE - listenerRoomConnect()');

      const newTab = await controllerbot.newTab(this.pptr.client);
      const [roomID] = await Promise.all([
        this.createSocketListener('room connect', await this.createDevSocket(newTab, this.devIO)),
        controllerbot.click('.person', newTab, 1000)
      ]); return roomID;

    }); // await pptr.page.exposeFunction('listenerRoomConnect', link=>{
  }; // async listenerRoomConnect(){


  async checkTimeCSS(socket, socketPartner){ log('checkTimeCSS()');
    await this.pptr.page.exposeFunction('checkTimeCSS', async ()=>{ log('EXPOSE - checkTimeCSS');

      const msg = {
        msg: "sample message22..",
        room: this.config.test_room,
        usertoken: this.config.test_client2.token,
        date: '12/34/5678, 12:34 pm'
      };

      const [d] = await Promise.all([
        this.createSocketListener('msg', socket),
        this.emitMsg(socketPartner, 'chat message', msg, 1000)
      ]); return d;

    }); // await this.pptr.page.exposeFunction('checkTimeCSS', async ()=>{
  }; // async checkTimeCSS(socket, socketPartner){


  async incomeMsg(){ log('incomeMsg()');
    await this.pptr.page.exposeFunction('incomeMsg', async ()=>{ log('EXPOSE - incomeMsg');

      const newTab = await controllerbot.newTab(this.pptr.client);

      // emit sample message to trigger websocket
      this.emitMsg(await this.createDevSocket(newTab, this.devIO), 'msg', 'new sample message');

      // check if message was recieved at partner
      return await newTab.evaluate(()=>{
        const lastElement = document.querySelector('.chat div:last-child');
        if(lastElement.textContent == "new sample message" &&
        lastElement.getAttribute('class') == 'bubble you' ) return true;
      }); // return await newTab.evaluate(()=>{

    }); // await pptr.page.exposeFunction('incomeMsg', link=>{
  }; // async incomeMsg(){

}; // class ListenerEvents{




export class Listener extends ListenerEvents{

  constructor(pptr, devIO){ log('class Listener - constructor()');
    super();

    this.pptr = pptr;
    this.devIO = devIO;

    this.config = new Config();
  }; // constructor(pptr, devIO){

  async createDevSocket(page, devIO){ log('createDevSocket()');
    const [devSocket] = await Promise.all([
      controller.rootConnect(devIO),
      controllerbot.openLink(page, this.config.devLink)
    ]); return devSocket;
  }; // async createDevSocket(){

  createSocketListener(name, socket){ return new Promise(resolve => { log(`createSocketListener() - Listener Name: ${name}`);
    socket.on(name, data=>{ log(`createSocketListener() - socket.on() - data: ${JSON.stringify(data, null, 4)}`);
      resolve(data);
     }); // socket.on(name, data=>{
  })}; // createSocketListener(name, socket){

  async emitMsg(socket, name, msg, delay){ log(`emitMsg() - Listener Name: ${name} - Message: ${JSON.stringify(msg, null, 4)} - Delay: ${delay}`);
    if(delay) await new Promise(resolve => setTimeout(resolve, delay));
    socket.emit(name, msg);
  }; // emitMsg(socket){

}; // class Listener {
