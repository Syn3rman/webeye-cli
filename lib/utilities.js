const fs = require('fs');
const request = require('request');
const {baseUrl} = require('../config/secrets');

let keyConfig = require('path').resolve(__dirname, '..')+'/.config';
let cookieConfig = require('path').resolve(__dirname, '..')+'/.cookie-jar';

function isKeySet(){
  try{
    apiKey = fs.readFileSync(keyConfig, {encoding: 'utf-8'});
  }
  catch(err){
    return false;
  }
  return true;
}

function isCookieSet(){
  try{
    cookieData = fs.readFileSync(cookieConfig, {encoding: 'utf-8'});
  }
  catch(err){
    return false;
  }
  return true;
}

const shorten = async (originalUrl)=>{
  if(!isCookieSet()){
    console.log("Please sign in to continue. Try running webeye login to get started.");
    return;
  }
  else if(!isKeySet()){
    console.log("Set api key to continue. Try running webeye set-key.");
    return;
  }
  else{
    let newUrl = `${baseUrl}/api/newUrl`;
    const jar = request.jar();
    const cookie = request.cookie(`token=${cookieData}`);
    jar.setCookie(cookie, newUrl);
    request.post({url: newUrl, jar: jar, auth: {'bearer': apiKey}, json: {'originalUrl': originalUrl}},
    (err,result, body)=>{
      if(err){
        console.log("There was some error with the server, try again.");
      }
      else{
        if(body.success === false){
          console.log(body.msg.red);    
        }
        else{
          console.log("Here's your url:".green, body.minifiedUrl);
        }
      }
    })
  }
}

module.exports = {
  shorten,
}