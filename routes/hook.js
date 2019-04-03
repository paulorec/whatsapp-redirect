const axios = require('axios');
const uuid = require('uuid/v1');
const express = require('express');

const PHONE_TO_REDIRECT = process.env.phone_to_redirect;
const SOURCE_TO_REDIRECT = process.env.phone_source;
const API_TOKEN = process.env.api_token;

const API_END_POINT = 'https://www.waboxapp.com/api/send/chat';


var router = express.Router();
/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("----------");
  console.log("Receiving payload:");
  console.log("params 2: ", req.body);
  console.log("");

  if(req.body.event === 'message') {
    forward(req, res);
  }
  res.send('ok!');
});

function forward(req, res) {
    
    sendToWhats(buildMessage(req, res))
    .then(x => console.log("Response is: ", x.data))
    .catch(x => console.log("Error Response:", x.data));
};

function buildMessage(req, res) {

    var src = req.body["contact[uid]"];
    var name = req.body["contact[name]"];
    var text = req.body["message[body][text]"];

    console.log("sourceName", name);
    console.log("sourceNumber", src);
    console.log("messageText", text);

    return `*${name}* (${src}) _wrote_:
        ${text}
`;    

};

async function sendToWhats(text) {
    let payload = {
        token : API_TOKEN,
        uid : SOURCE_TO_REDIRECT,
        to : PHONE_TO_REDIRECT,
        text : text,
        custom_uid : uuid()
    };

    console.log("payload is ",payload);

    return axios.post(API_END_POINT,payload);
}
module.exports = router;
