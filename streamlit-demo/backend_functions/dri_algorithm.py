from pydantic import BaseModel, Field

class DRIInput(BaseModel):
    weight: float = Field(..., description="The weight of the individual in kilograms.", ge=0)
    height: float = Field(..., description="The height of the individual in centimeters.", ge=0)
    age: int = Field(..., description="The age of the individual in years.", ge=0)
    sex: str = Field(..., description="The gender of the individual ('male' or 'female').", regex='^(male|female)$')
    activity_level: str = Field(..., description="The activity level of the individual.", regex='^(sedentary|lightly active|moderately active|very active|extra active)$')

# Constants for macronutrient percentages
PROTEIN_PERCENTAGE = 0.2
FAT_PERCENTAGE = 0.3
CARB_PERCENTAGE = 0.5

# Constants for activity multipliers
ACTIVITY_MULTIPLIERS = {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'extra active': 1.9
}

def calculate_dri(input_data: DRIInput):
    """
    Calculate Daily Recommended Intake (DRI) based on user input.

    Parameters:
    - input_data (DRIInput): Pydantic model containing input data.

    Returns:
    dict: A dictionary containing calculated values for DRI.

    Example Usage:
    input_data = DRIInput(weight=70, height=175, age=25, sex='male', activity_level='moderately active')
    result = calculate_dri(input_data)
    print(result)
    """

    # Extracting values from input_data
    weight = input_data.weight
    height = input_data.height
    age = input_data.age
    sex = input_data.sex.lower()
    activity_level = input_data.activity_level.lower()

    # Validate weight, height, and age
    if weight < 0 or height < 0 or age < 0:
        raise ValueError("Weight, height, and age must be non-negative values.")

    # BMR Mifflin-St Jeor Equation for Total Calories
    if sex == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    elif sex == 'female':
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        raise ValueError("Invalid sex. Please enter 'male' or 'female'.")

    # Adjust for activity level
    if activity_level not in ACTIVITY_MULTIPLIERS:
        raise ValueError("Invalid activity level. Please choose from 'sedentary', 'lightly active', 'moderately active', 'very active', or 'extra active'.")

    total_calories = bmr * ACTIVITY_MULTIPLIERS[activity_level]

    # Calculate protein, fat, and carb intake based on percentages
    protein_calories = total_calories * PROTEIN_PERCENTAGE
    fat_calories = total_calories * FAT_PERCENTAGE
    carb_calories = total_calories * CARB_PERCENTAGE

    protein_grams = protein_calories / 4
    fat_grams = fat_calories / 9
    carb_grams = carb_calories / 4

    return {
        'total_calories': total_calories,
        'protein_calories': protein_calories,
        'fat_calories': fat_calories,
        'carb_calories': carb_calories,
        'protein_grams': protein_grams,
        'fat_grams': fat_grams,
        'carb_grams': carb_grams
    }
