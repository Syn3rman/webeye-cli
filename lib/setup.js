const { prompt } = require('enquirer');
const {baseUrl} = require('../config/secrets');
const request = require('request');
const fs = require('fs');
const colors = require('colors');

const login = async ()=>{
  questions = [
    {
      type: 'input',
      name: 'email',
      message: 'Email: ',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password: ',
    }
  ];
  let answers = await prompt(questions);
  url = `${baseUrl}/users/login`;
  request.post(url, {json:answers},
    (error, res, body) => {
      if (error) {
        console.error("There was some problem with the sesrver, try again.");
        return
      }
      else{
        if(body.success === true){
          let expression = res.headers['set-cookie'][0];
          let cookie = expression.substring(expression.indexOf('=')+1, expression.indexOf(';'));
          let destination = require('path').resolve(__dirname, '..')+'/.cookie-jar';
          fs.writeFile(destination, cookie, (er)=>{
            if(er){
              console.log("Error occured, please try again.".red);
            }
            else{
              console.log(body.msg.green);    
            }
          });
        }
        else{
          console.log(body.msg.red);
        }
      }
    });
}

const setKey = async ()=>{
  const response = await prompt({
    type: 'input',
    name: 'apiKey',
    message: 'Enter your api key: ',
  });
  let destination = require('path').resolve(__dirname, '..')+'/.config';
  fs.writeFile(destination, response['apiKey'], (err)=>{
    if(err){
      console.log("An error occured, try again. ".red);
    }
    else{
      console.log("Successfully set key!".green);
    }
  })
}

module.exports = {
  login,
  setKey,
}