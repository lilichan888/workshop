//Expecting Parameters from Connect:
// tableName
// key
// keyValue

// Global Variables
 
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
 
// API calls:
 
async function readDDB(paramsQuery) {
    try {
        const getData = await docClient.query(paramsQuery).promise();
        return getData;
    }
    catch (err) {
        console.log('error' + err);
        throw err;
    }
}
 
// Lambda function logic:
 
exports.handler = async(event, context) => {
    console.log('Loading event' + JSON.stringify(event));
    const paramsQuery = {
        TableName: event.Details.Parameters.tableName,
        KeyConditionExpression: event.Details.Parameters.key + " = :var1",
        ExpressionAttributeValues: { ":var1": event.Details.Parameters.keyValue }
    };
    const getData = await readDDB(paramsQuery);
    if (getData.Count == 0) {
        let result = {
            "recordCount": "0"
        };
        console.log('result: ' + result);
        return result;
    }
    console.log('result: ' + JSON.stringify(getData.Items[0]));
    return getData.Items[0];
};