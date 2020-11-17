/*
███████████████████████████████████████████████████████████████████████████████
██******************** PRESENTED BY t33n Software ***************************██
██                                                                           ██
██                  ████████╗██████╗ ██████╗ ███╗   ██╗                      ██
██                  ╚══██╔══╝╚════██╗╚════██╗████╗  ██║                      ██
██                     ██║    █████╔╝ █████╔╝██╔██╗ ██║                      ██
██                     ██║    ╚═══██╗ ╚═══██╗██║╚██╗██║                      ██
██                     ██║   ██████╔╝██████╔╝██║ ╚████║                      ██
██                     ╚═╝   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝                      ██
██                                                                           ██
███████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████████
.__                              __           .__               .__
|__| _____ ______   ____________/  |_  ______ |  |  __ __  ____ |__| ____   ______
|  |/     \\____ \ /  _ \_  __ \   __\ \____ \|  | |  |  \/ ___\|  |/    \ /  ___/
|  |  Y Y  \  |_> >  <_> )  | \/|  |   |  |_> >  |_|  |  / /_/  >  |   |  \\___ \
|__|__|_|  /   __/ \____/|__|   |__|   |   __/|____/____/\___  /|__|___|  /____  >
         \/|__|                        |__|             /_____/         \/     \/
*/
import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import timeout from 'connect-timeout';
import http from 'http';
//import helmet from 'helmet';
//import morgan from 'morgan';

import { fileURLToPath } from 'url';
import fs from 'fs';
import path, { dirname } from 'path';
import os from 'os';

/*################ controller ################*/
import controller from './controller/socketio.mjs';
import controllermongodb from './controller/mongodb.mjs';
import controllerEndpoints from './controller/endpoints.mjs';

/*################ logs ################*/
import log from 'fancy-log';
import chalkAnimation from 'chalk-animation';
import gradient from 'gradient-string';
import chalk from 'chalk';

  const app = express(),
       port = process.env.PORT || 1337,
     server = http.createServer(app),

     osHOME = os.homedir(),
 osPLATFORM = os.platform(),
json_config = JSON.parse(  fs.readFileSync('./admin/config.json', 'utf8')  ),
      limit = json_config.request_limit,
 __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);
log( 'Current working directory: ' + __dirname );


/*
 ████████████████████████████████████████████████████████████████████████████████
 */
 var ads = gradient('red', 'white').multiline([
        '',
        'Presented by',
        '████████╗██████╗ ██████╗ ███╗   ██╗',
        '╚══██╔══╝╚════██╗╚════██╗████╗  ██║',
        '   ██║    █████╔╝ █████╔╝██╔██╗ ██║',
        '   ██║    ╚═══██╗ ╚═══██╗██║╚██╗██║',
        '   ██║   ██████╔╝██████╔╝██║ ╚████║',
        '   ╚═╝   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝ Software'
 ].join('\n'));
 console.log(ads);
 console.log( '\nCheck my Github Profile: ' + chalk.white.bgGreen.bold(' github.com/CyberT33N ')  + '\n\n');
 console.log( gradient('white', 'black')('\n\n=======================================\n\n') );



// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
/*
log( 'rate limit value: ' + limit );
const apiLimiter = rateLimit({
  windowMs: limit,
  message: "Too many POST requests created from this IP, please try again in " + limit + "ms",
  max: 1 //<-- max limit
});
*/



// parse application/json
app.use( bodyParser.json() );

// adding Helmet to enhance your API's security
//app.use( helmet() );

// enabling CORS for all requests
//app.use( cors() );

// adding morgan to log HTTP requests
//app.use( morgan('combined') );

// set chat app website..
app.use(express.static(__dirname + '/website'));










// log all requests..
app.use((req, res, next)=>{
  if( path.extname(path.basename(req.url)) ) log("The file " + path.basename(req?.url) + " was requested.");
  else log("The endpoint " + path.basename(req?.url) + " was requested.");
  next();
}); // app.use((req, res, next)=>{










  /*
  ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗███████╗
  ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝██╔════╝
  █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║   ███████╗
  ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║   ╚════██║
  ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║   ███████║
  ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
  */


// POST request where we take User Token and send back Object with User Details to Client
app.post('/api/getUserDetails', (req, res)=>{(async()=>{
  await controllerEndpoints.getUserDetails(req, res);
})().catch((e)=>{  log('ASYNC - POST - Error at /api/getUserDetails - Error: ' + e)  })});

// POST request where we take Room ID and send back Object with Room Details to Client
app.post('/api/getRoomDetails', (req, res)=>{(async()=>{
  await controllerEndpoints.getRoomDetails(req, res);
})().catch((e)=>{  log('ASYNC - POST - Error at /api/getRoomDetails - Error: ' + e)  })});










// start server
server.listen(port, (async()=>{ log('Server was started.. Listening on port: ' + port);
  if( !await controllermongodb.connectMongoDB() ) return false;
  controller.rootConnect(server);
})().catch((e)=>{  log('ASYNC - Error at main start server.. Error: ' + e)  }));