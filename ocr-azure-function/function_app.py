import azure.functions as func
import logging
import cv2
import numpy
import json
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="menu_ocr_trigger", methods=["POST"])
def menu_ocr_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    img_base64 = req.params.get('img')
    
    if not img_base64:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            img_base64 = req_body.get('img')

    if img_base64:
        img = img_base64 # decode_base64(img_base64)
        model_result = run_model(img)
        return func.HttpResponse(json.dumps(model_result), mimetype="application/json")

    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a img_base64 in the query string or in the request body for a personalized response.",
             status_code=200
        )

def run_model(image_data):
    
    menu_data = [
        {"menu_item": "Pancakes", "menu_section": "Breakfast"},
        {"menu_item": "Eggs Benedict", "menu_section": "Breakfast"},
        {"menu_item": "Coffee", "menu_section": "Beverages"},
        {"menu_item": "Club Sandwich", "menu_section": "Lunch"},
        {"menu_item": "Caesar Salad", "menu_section": "Lunch"},
        {"menu_item": "Iced Tea", "menu_section": "Beverages"},
        {"menu_item": "Grilled Salmon", "menu_section": "Dinner"},
        {"menu_item": "Spaghetti Bolognese", "menu_section": "Dinner"},
        {"menu_item": "Mango Smoothie", "menu_section": "Beverages"},
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
