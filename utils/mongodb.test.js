const {storeMessages, getUserDetails, getRoomDetails, connectMongoDB} = require('../services/mongodb'),
        expect = require('expect'),

            fs = require('fs'),
   json_config = JSON.parse(  fs.readFileSync('./admin/config.json', 'utf8')  ),
  test_client1 = json_config.test.user[0],
  test_client2 = json_config.test.user[1],
     test_room = json_config.test.room,


           log = require('fancy-log'),
chalkAnimation = require('chalk-animation'),
      gradient = require('gradient-string'),
         chalk = require('chalk');






describe('MongoDB Services', () => {






  describe('connectMongoDB()', () => {

    it('Connect to MongoDB Database - Should return {code : "SUCCESS"}', async() => {
      expect( await connectMongoDB() ).toMatchObject({code : "SUCCESS"});
    });

    xit('Error while try to connect to MongoDB Database - Should return {code : "ERROR"}', async() => {
      expect( await connectMongoDB() ).toMatchObject({code : "ERROR"});
    });

  }); // describe('connectMongoDB()()', () => {







  describe('storeMessages()', () => {

    it('Simulate NPE - Should return {"msg": "NPE"}', async() => {
      expect( await storeMessages({"msg": null,"room": "1234", "usertoken": "a"}) ).toStrictEqual( {"msg": "NPE"} );
    });

    it('Simulate not existing Room ID - Should return {"msg": "ROOM ID NOT FOUND"}', async() => {
      expect( await storeMessages({"msg": "sample message..", "room": "wrong_room_ID", "usertoken": test_client1.token}) ).toStrictEqual( {"msg": "ROOM ID NOT FOUND"} );
    });

    it('Successfully updating of field - Should return { "result": {"n": 1} }', async() => {
      expect( await storeMessages({"msg": "sample message..", "room": test_room, "usertoken": test_client1.token}) ).toMatchObject({ "result": {"n": 1} });
    });

    xit('Simulate error while updating of field - Should return { "result": {"n": 0} }', async() => {
      expect( await storeMessages({"msg": "sample message..", "room": test_room, "usertoken": test_client1.token}) ).toMatchObject({ "result": {"n": 0} });
    });

  }); // describe('storeMessages()', () => {





  describe('getUserDetails()', () => {

    it('Check if User can be found by token - Should return object', async() => {
      expect( typeof await getUserDetails(test_client1.token) ).toBe('object');
    });

    it('Simulate User not found by token - Should return undefined', async() => {
      expect( await getUserDetails('wrong_token') ).toBe(undefined);
    });

    it('Simulate NPE - Should return undefined', async() => {
      expect( await getUserDetails(null) ).toBe(undefined);
    });

  }); // describe('getUserDetails()', () => {








  describe('getRoomDetails()', () => {

    it('Check if User can be found by token - Should return object', async() => {
      expect( typeof await getRoomDetails(test_room) ).toBe('object');
    });

    it('Simulate User not found by token - Should return undefined', async() => {
      expect( await getRoomDetails('wrong_roomID') ).toBe(undefined);
    });

    it('Simulate NPE - Should return undefined', async() => {
      expect( await getRoomDetails(null) ).toBe(undefined);
    });

  }); // describe('getRoomDetails()', () => {








}); // describe('mongodb service', () => {