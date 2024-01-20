from flask import Flask, jsonify, request
import pandas as pd
import requests
import random
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

@app.route('/recipeoftheday', methods=['GET'])
def get_recipe_of_the_day():
    try:
        random_row = csv_data.sample().to_dict(orient='records')[0]
        return jsonify({"random_recipe": random_row})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/searchRecipeByIng', methods=['GET'])
def search_recipe_by_ingredients():
    try:
        ing_used = set(request.args.get('ingUsed', '').split(','))
        ing_not_used = set(request.args.get('ingNotUsed', '').split(','))

        filtered_recipes = csv_data[
            csv_data['ingredients'].apply(lambda x: set(eval(x)) if isinstance(x, str) else set()) &
            ing_used.issubset &
            ~ing_not_used.intersection
        ]

        result_list = filtered_recipes.to_dict(orient='records')

        return jsonify({"filtered_recipes": result_list})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
