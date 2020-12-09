/*################ Operating System ################*/
import os from 'os';
const osPlatform = os.platform();

/*################ Bot ################*/
import puppeteer from 'puppeteer';

/*################ Controller ################*/
import controllerLib from '../controller/lib.mjs';

/*################ Logs ################*/
import log from 'fancy-log';
import chalkAnimation from 'chalk-animation';
import gradient from 'gradient-string';
import chalk from 'chalk';



class getBrowserConfig{

  createArgs(){ log( 'createArgs()' );
    const args = [
      this.windowSizeComplete,
      '--no-sandbox',
      // '--disable-setuid-sandbox',
      //'--disable-popup-blocking',
      //'--disable-notifications',
      //'--disable-dev-shm-usage',
      '--force-webrtc-ip-handling-policy=disable-non-proxied-udp',
      '--lang=en'
    ]; if(this.headless) args.push('--disable-gpu'); return args;
  }; // createArgs(){


  // check if browser extensions was defined in config.json file. If true we add them to our args array
  checkExtensions(extensionlist, chromeExtensionPath, args){ log( `checkExtensions() - chromeExtensionPath: ${chromeExtensionPath}` );
    if( extensionlist !== null ){ log('extensionlist before: ' + extensionlist);

      var extensionlistAR = [];
      for( const d in extensionlist ){
        extensionlistAR.push( chromeExtensionPath + extensionlist[d] );
        args.push( '--load-extension=' + chromeExtensionPath + extensionlist[d] );
      } // for( const d of extensionlist ){

      extensionlist = '--disable-extensions-except=' + extensionlistAR.join( ',' );
      args.push(extensionlist);
      log(`extensionlist after: ${extensionlist}`);
      return args;

    } // if( extensionlist !== null ){
  }; // checkExtensions(){


  // check system OS and then create path related to OS
  getPath(){ log( 'getPath() - osPlatform: ' + osPlatform );
    if( osPlatform == 'darwin' ){
      this.browserProfilePath = './lib/browserProfiles/';
      this.chromeExtensionPath  = './lib/chromeextension/';
    }
    if( osPlatform == 'linux' ) {
      this.browserProfilePath = './lib/browserProfiles/';
      this.chromeExtensionPath  = './lib/chromeextension/';
    }
    if( osPlatform == 'win32' ){
      this.browserProfilePath = '../../../../../lib/browserProfiles/';
      this.chromeExtensionPath  = '../../../../../lib/chromeextension/';
    }
  }; // getPath(){

}; // class getBrowserConfig {






export class startBrowser extends getBrowserConfig{

  constructor(){ log('class getBrowserConfig - constructor()');
    super();

    const config = controllerLib.getConfig();
    this.config_browser_profile = config.bot.browser_profile;
    this.headless = config.bot.headless;
    this.extensionlist = config.bot.extensionlist;
    this.windowWidth = config.bot.windowWidth;
    this.windowHeight = config.bot.windowHeight;
    this.windowSizeComplete = `--window-size=${this.windowWidth},${this.windowHeight}`;

    this.getPath();

    this.args = this.checkExtensions(this.extensionlist, this.chromeExtensionPath, this.createArgs());

    log(`
      windowSizeComplete: ${this.windowSizeComplete}
      headless: ${this.headless}
      config_browser_profile: ${this.config_browser_profile}
      args: ${this.args}
      browserProfilePath: ${this.browserProfilePath}
    `);

  }; // constructor(){


  async launch(){ log('launch() - args: ' + this.args);
    try {
        this.client = await puppeteer.launch({
        //executablePath: '/snap/bin/chromium',
        //executablePath: '/usr/bin/google-chrome',
        //executablePath: '/home/user/Downloads/Linux_x64_749751_chrome-linux/chrome-linux/chrome',
        // executablePath: '/home/user/Downloads/firefox-78.0a1.en-US.linux-x86_64/firefox/firefox',
        devtools: true,
        headless: this.headless, // true or false
        userDataDir: this.browserProfilePath + this.config_browser_profile,
        args: this.args
      });

      const page = await new Window().newTab(this.client);
      await new Simulate().setViewport(page, this.windowWidth, this.windowHeight);
      return {"client": this.client, "page": page};

    } catch(e) { error(e); }; // catch(e) {
  } // async function launch(){


  async error(e){ log('class startBrowser - error() - error: ' + e);
    if( e?.length == undefined ) log( 'startBrowser() - error is undefinied.. we restart now the browser..' );
    if( e?.name == 'TimeoutError' ) log( 'startBrowser() - TimeoutError was found.. we restart now the browser..' );
    if( e == 'Error: connect ECONNREFUSED 0.0.0.0:4444') log( 'startBrowser() - ECONNREFUSED error found..' );

    await this.client?.close();
    await this.launch();
  }; // async error(e){

}; // export class startBrowser extends getBrowserConfig{
















export class Simulate{

  async click(css, page, delay){ log(`class Simulate - click() - CSS Selector: ${css} - Delay: ${delay}`);
    if(delay) await new Promise(resolve => setTimeout(resolve, delay));
    await page?.click(css);
  }; // async click(css, page, delay){

  async typeText(page, css, msg, delay){ log(`class Simulate - typeText() - CSS Selector: ${css} - Message: ${msg} - Delay: ${delay}`);
    await page.type(css, msg, { delay: delay });
  }; // async typeText(page, css, msg, delay){

  async setViewport(page, windowWidth, windowHeight){ log(`class Simulate - setViewport() - windowWidth: ${windowWidth} - windowHeight: ${windowHeight}`);
    await page.setViewport({width: windowWidth, height: windowHeight});
  }; // async setViewport(page, windowWidth, windowHeight){

}; // export class Simulate{
















export class Window{

  async openLinkNewTab(client, link, delay){ log(`class Window - openLinkNewTab() - Link: ${link} - Delay: ${delay}`);
    const page = await this.newTab(client);
    await this.openLink(page, link);
    if(delay) await new Promise(resolve => setTimeout(resolve, delay));
    return page;
  }; // async openLinkNewTab(client, link, delay){


  async openLink(page, link){ log( 'class Window - openLink() - link: ' + link );
    try {
      await page.goto(link, {waitUntil: 'networkidle0', timeout: 35000});
    } catch(e) { log( 'openLink() - Error while open link.. Error: ' + e?.message );

      if( e?.message.match('Navigation timeout of') ) log( '#2 - Navigation timeout was found we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_EMPTY_RESPONSE' ) ) log( '#2 - net::ERR_EMPTY_RESPONSE was found we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_NETWORK_CHANGED' ) ) log( '#2 - net::ERR_NETWORK_CHANGED was found we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_NAME_NOT_RESOLVED' ) ) log( '#2 - net::ERR_NAME_NOT_RESOLVED was found we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_CONNECTION_CLOSED' ) ) log( '#2 - net::ERR_CONNECTION_CLOSED was found we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_PROXY_CONNECTION_FAILED' ) ) log( '#2 - net::ERR_PROXY_CONNECTION_FAILED was found.. Maybe your proxy is offline? Maybe change your proxy.. However we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_CONNECTION_REFUSED' ) ) log( '#2 - net::ERR_CONNECTION_REFUSED was found we reload page in 30 seconds..\n\n' );
      if( e?.message.match( 'net::ERR_CONNECTION_TIMED_OUT' ) ) log( '#2 - net::ERR_CONNECTION_TIMED_OUT was found we reload page in 30 seconds..\n\n' );

      // optional timeout
      await new Promise(resolve => setTimeout(resolve, 30000));
      await this.openLink(page, link);

    }; return true;
  }; // async openLink(page, link){


  async newTab(client){ log( 'class Window - newTab()');
    const newTab = await client.newPage();
    await newTab.bringToFront();
    return newTab;
  }; // async newTab(client){

}; // export class Window{
