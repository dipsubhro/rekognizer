import json
import boto3
import base64
import os
import urllib.request

# Initialize AWS client
rekognition = boto3.client('rekognition')

# Gemini API configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"


def lambda_handler(event, context):
    """
    This Lambda function analyzes an image, gets labels from AWS Rekognition,
    and then generates a description using the Gemini API.
    """
    try:
        # Get the base64 encoded image from the request body
        body = json.loads(event.get('body', '{}'))
        image_base64 = body.get('image')

        if not image_base64:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No image provided in the request body.'})
            }

        # Decode the base64 string to bytes
        image_bytes = base64.b64decode(image_base64)

        # 1. Call AWS Rekognition to detect labels in the image
        rekognition_response = rekognition.detect_labels(
            Image={'Bytes': image_bytes},
            MaxLabels=10,
            MinConfidence=80
        )
        labels = [label['Name'] for label in rekognition_response['Labels']]

        if not labels:
             return {
                'statusCode': 200,
                'body': json.dumps({
                    'labels': [],
                    'description': "Could not detect any labels with high confidence."
                })
            }

        # Return only the detected labels
        # 2. Call Gemini API to generate a description
        description = "Could not generate description."
        if labels:
            try:
                prompt = f"Based on these detected objects in an image: {', '.join(labels)}. Please provide a natural, descriptive sentence about what this image likely contains. Keep it concise."
                
                request_body = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }
                
                data = json.dumps(request_body).encode('utf-8')
                
                # Add API key to URL
                url_with_key = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
                
                req = urllib.request.Request(
                    url_with_key,
                    data=data,
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req) as response:
                    response_body = response.read().decode('utf-8')
                    gemini_response = json.loads(response_body)
                    description = gemini_response.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip()
                    
            except Exception as gemini_error:
                print(f"Gemini API Error: {str(gemini_error)}")
                description = "Error generating description."

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'labels': labels,
                'description': description
            })
        }

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An internal server error occurred.'})
        }