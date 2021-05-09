const AWS = require('aws-sdk');
var pinpoint = new AWS.Pinpoint({ region: process.env.region });

exports.handler = (event, context, EmergencyDB) => {
    var phoneNumber = event.Details.Parameters.concernedNumber;
    //Make the PIN
    function makeId() {
        var text = "";
        var possible = "0123456789"; //The possible digits

        for (var i = 0; i < process.env.pinLength; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    var PIN = makeId();

    //Check the number is a mobile
    var paramsMobile = {
        NumberValidateRequest: {
            //IsoCountryCode: 'STRING_VALUE',
            PhoneNumber: phoneNumber
        }
    };
    pinpoint.phoneNumberValidate(paramsMobile, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(phoneNumber, "is", data.NumberValidateResponse.PhoneType);
            if (data.NumberValidateResponse.PhoneType == "MOBILE") { // If phone number is a mobile send the PIN
                var message = JSON.stringify({ PIN: PIN, Length: process.env.pinLength, PhoneType: data.NumberValidateResponse.PhoneType  });
                EmergencyDB(null, JSON.parse(message));
                console.log(PIN);
                var params = {
                    ApplicationId: process.env.appId,
                    MessageRequest: {
                        'Addresses': {
                            [phoneNumber]: {
                                'ChannelType': 'SMS',
                            }
                        },
                        'MessageConfiguration': {
                            'SMSMessage': {
                                'Body': 'Your one time PIN is ' + PIN,
                                'MessageType': 'TRANSACTIONAL',
                                'SenderId': process.env.senderId,
                            }
                        }
                    }
                };
                pinpoint.sendMessages(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else console.log(data); // successful response
                });
            }
        }
    });
};
