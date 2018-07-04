'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server

  let token = "EAAaZBFnOFPhYBAJUEOXgFa7fHg8PfUwE0d9X4nEJZAN1mOF8SEZC7MfthoKAR1xuHOQPz0f9lJdSWF0rGE2H3VBnDwK9zpJ67Y122AyOEZBSzLQTqGbl58sxVIhSElGZBZBDZBEK3LMqwRVUQ6SUZB1COjfJhZAkPWhy1QsG91ZAm57ekB9i5KZAOqX"
  // Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 let messaging_events = req.body.entry[0].messaging
 for(let i = 0; i < messaging_events.length; i++)
 {
     let event = messaging_events[i]
     let sender = event.sender.id
     if (event.message && event.message.text){
         let text = event.message.text
         sendText(sender, text.substring(0,100))
     }
 }
 res.sendStatus(200)
    // let body = req.body;
  
    // // Checks this is an event from a page subscription
    // if (body.object === 'page') {
  
    //   // Iterates over each entry - there may be multiple if batched
    //   body.entry.forEach(function(entry) {
  
    //     // Gets the message. entry.messaging is an array, but 
    //     // will only ever contain one message, so we get index 0
    //     let webhook_event = entry.messaging[0];
    //     console.log(webhook_event);
    //   });
  
    //   // Returns a '200 OK' response to all requests
    //   res.status(200).send('EVENT_RECEIVED');
    // } else {
    //   // Returns a '404 Not Found' if event is not from a page subscription
    //   res.sendStatus(404);
    // }
  
  });
  function sendText(sender, text){
      let messageData = {text: text}
      switch(text){
        case 'hi' || "hello":
        messageData.text="hey,What's up ";
        break;
        default:
        messageData.text="for more info: https://neta.co.in";
        break;
    }
      request({
          url: "https://graph.facebook.com/v2.6/me/messages",
          qs: {access_token: token},
          method: "POST",
          json: {
              recipient: {id: sender},
              message : messageData
          }
        },function(error, response, body){
            if(error){
                console.log("sending error")
            }
            else if(response.body.error){
                console.log("response body error")
            }
        })
  }

  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "EAAaZBFnOFPhYBAIRvDPqiwJdD2ujJ4WAxBeOY0wI19ZBkatTOwR8lrznwGcdjMTVC8J84eSSA74V7uD0AxbiqmhGDpUIuX75i4TD"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));