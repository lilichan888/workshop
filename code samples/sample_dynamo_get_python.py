# Import libraries required for this function
import boto3
from boto3.dynamodb.conditions import Key
import os

# Define the lambda handler
def lambda_handler(event, context):
    
    # Declare an empty dictionary
    response = {}

    # Try to get the incoming key, key value, and table name
    try:
        key = event['Details']['Parameters']['key']
        keyValue = event['Details']['Parameters']['keyValue']
        tableName = event['Details']['Parameters']['tableName']
    
    # If we didn't receive the parameters with the incoming event return an exception
    except:
        response.update({'status_code': 'noparams'})
        response.update({'lambdaResult': 'error'})
        
        # Return the response dictionary
        return response
    
    # Define the DynamoDB connection
    dynamodb = boto3.resource('dynamodb')

    # Get the table name from the environment variables
    table = dynamodb.Table(tableName)
    
    #Perform the search based on the received phone
    dynamo_response = table.get_item(
        Key={
            key : keyValue
            
        }
    )

    # If we got a record, add it to the dictionary
    if 'Item' in dynamo_response:
        response.update(dynamo_response['Item'])

        # Also update the dictionary with a result code and a customer found flag
        response.update({'customer_found': '1'})
        response.update({'lambdaResult': 'success'})
        
    # If we didnt get a record, update the dictionary with success for the result and a 0 for customer found
    else:
        response.update({'customer_found': '0'})
        response.update({'lambdaResult': 'success'})
        
    # Return the response dictionary
    return response