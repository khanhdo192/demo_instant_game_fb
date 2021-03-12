var request = require('request');

// Messenger code
var access_token = 'EAAEOf4tX4KIBANbjNcWlpiFnNPh7z4K7tnNopxMM0LZCjEJYItBlbRDXpJZBKPlpSlLSupcwhRmRc4wn1HfqRFSyo9xdZBbGHAow1rFF7t5wKy4m1oqs34kxRsEFHCmQqIQRabPbrwVZAtpGr6TPHSOuVQgBbktbB0KjKM08xQZDZD';

module.exports = function(app) {

    //
    // GET /bot
    //
    app.get('/bot', function(request, response) {
        if (request.query['hub.mode'] === 'subscribe' && 
            request.query['hub.verify_token'] === '123456') {            
            console.log("Validating webhook");
            response.status(200).send(request.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.sendStatus(403);          
        }  
    });

    //
    // POST /bot
    //
    app.post('/bot', function(request, response) {
       var data = request.body;
       console.log('received bot webhook');
        // Make sure this is a page subscription
        if (data.object === 'page') {
            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {
               var pageID = entry.id;
               var timeOfEvent = entry.time;
                // Iterate over each messaging event
                entry.messaging.forEach(function(event) {
                    if (event.message) {
                        receivedMessage(event);
                    } else if (event.game_play) {
                        receivedGameplay(event);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    }
                });
            });
        }
        response.sendStatus(200);
    });

    //
    // Handle messages sent by player directly to the game bot here
    //
    function receivedMessage(event) {
      
    }

    //
    // Handle game_play (when player closes game) events here. 
    //
    function receivedGameplay(event) {
        // Page-scoped ID of the bot user
        var senderId = event.sender.id; 

        // FBInstant player ID
        var playerId = event.game_play.player_id; 

        // FBInstant context ID 
        var contextId = event.game_play.context_id;


        if (event.game_play.payload) {

            var payload = JSON.parse(event.game_play.payload);

            var scoutScore = payload['scoutScore'];

            var scoutImg = payload['scoutImg'];

            sendMessage(senderId, null, 'Bạn đã ghi được '+scoutScore+' điểm', "Play again!", null,scoutImg);

        }
        // Check for payload
        // if (event.game_play.payload) {
        //     //
        //     // The variable payload here contains data set by
        //     // FBInstant.setSessionData()
        //     //
        //     var payload = JSON.parse(event.game_play.payload);

        //     // In this example, the bot is just "echoing" the message received
        //     // immediately. In your game, you'll want to delay the bot messages
        //     // to remind the user to play 1, 3, 7 days after game play, for example.
        //     sendMessage(senderId, null, "Message to game client: '" + payload.message + "'", "Play now!", payload);
        // }
    }

    //
    // Send bot message
    //
    // player (string) : Page-scoped ID of the message recipient
    // context (string): FBInstant context ID. Opens the bot message in a specific context
    // message (string): Message text
    // cta (string): Button text
    // payload (object): Custom data that will be sent to game session
    // 
    function sendMessage(player, context, message, cta, payload, imageUrl) {
        var button = {
            type: "game_play",
            title: cta
        };

        if (context) {
            button.context = context;
        }
        if (payload) {
            button.payload = JSON.stringify(payload)
        }
        var messageData = {
            recipient: {
                id: player
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                        {
                            title: message,
                            image_url:imageUrl,
                            buttons: [button]
                        }
                        ]
                    }
                }
            }
        };

        callSendAPI(messageData);

    }

    function callSendAPI(messageData) {
        var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token='+access_token
        request({
            url: graphApiUrl,
            method: "POST",
            json: true,  
            body: messageData
        }, function (error, response, body){
            console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
        });
    }

}