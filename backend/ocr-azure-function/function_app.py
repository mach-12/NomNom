import base64
import azure.functions as func
import logging
import cv2
import numpy as np
import json
import easyocr
import re

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="menu_ocr_trigger", methods=["POST"])
def menu_ocr_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # reader = easyocr.Reader(['en'])
    img_base64 = req.params.get('img')
    if not img_base64:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            img_base64 = req_body.get('img')

    if img_base64:
        img = decode_base64(img_base64)
        model_result = "hi"#run_model(reader, img)
        return func.HttpResponse(json.dumps(model_result), mimetype="application/json")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a img_base64 in the query string or in the request body for a personalized response.",
             status_code=200
        )
    
    

def run_model(reader, image_data):
    ocr_result = reader.readtext(image_data)

    ocr_text = [i[1] for i in ocr_result[0]]

    numeric_pattern = re.compile(r'^\d+$')

    ocr_text_filtered = [item for item in ocr_text if not numeric_pattern.match(item)]


    menu_data = [
        {
            "menu_item":[i for i in ocr_text_filtered],
            "menu_section": ["" for i in ocr_text_filtered]
        }
    ]

    return menu_data

def preprocess(img_data):
    mean_vec = np.array([0.485, 0.456, 0.406])
    stddev_vec = np.array([0.229, 0.224, 0.225])
    norm_img_data = np.zeros(img_data.shape).astype('float32')
    for i in range(img_data.shape[0]):
         # for each pixel in each channel, divide the value by 255 to get value between [0, 1] and then normalize
        norm_img_data[i,:,:] = (img_data[i,:,:]/255 - mean_vec[i]) / stddev_vec[i]
    return norm_img_data

def decode_base64(data):
    img = base64.b64decode(data)
    img = cv2.imdecode(np.fromstring(img, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img.transpose((2,0,1))
    img = img.reshape(1, 3, 224, 224)
    img = preprocess(img)
    return img
