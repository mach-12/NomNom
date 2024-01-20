from flask import Flask, jsonify, request
import pandas as pd
import requests
from io import StringIO

app = Flask(__name__)

csv_url = "https://raw.githubusercontent.com/mach-12/NomNom/salik/database/dataset.csv"
csv_data = pd.read_csv(csv_url)

@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        data_list = csv_data.to_dict(orient='records')
        return jsonify({"data": data_list})
    
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/recipeInfo/<string:recipe_id>', methods=['GET'])
def get_recipe_info(recipe_id):
    recipe_data = csv_data[csv_data['_id'] == recipe_id]
    json_data = jsonify(recipe_data.to_dict(orient='records'))
    return json_data

if __name__ == '__main__':
    app.run(debug=True)
