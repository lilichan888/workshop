const AWS =require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});




exports.handler = (event, context, callback) => {
     //var d = Date.now()
     //console.log(d);
     var d = new Date()
     var seconds = Math.round(d.getTime() / 1000);
     console.log(seconds);
     var sporeTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"});
     console.log(sporeTime);
     //console.log('Spore time: '+ (new Date(sporeTime)).toISOString());
     
     const scanningParams ={
       TableName:'holidayCalendar',
       Limit:100,
       FilterExpression: ":dateNow between dateStart and dateEnd",
       ExpressionAttributeValues: {
           //":dateNow": Date.now()
        ":dateNow": seconds
    }
   };
  
  docClient.scan(scanningParams, function(err,data){
       
     // console.log(data.Items[0].reason); 
      if(err){
          callback(err,null);
      }else{
          if(data.Items[0] == null){
              const noHolidayResponse = JSON.stringify({reason: 'noHoliday'});
              callback(null,JSON.parse(noHolidayResponse ));
          }
          else{
          callback(null,data.Items[0]);
          }
      }
  });
};