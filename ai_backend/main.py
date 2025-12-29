import json
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io

# 1. Create the FastAPI app
app = FastAPI()

# 2. Load the pre-trained AI model and the labels
MODEL_PATH = "plant_disease_model_fixed2.h5"  # <-- Make sure this is your model's filename
LABELS_PATH = "labels.json"

model = tf.keras.models.load_model(MODEL_PATH)
with open(LABELS_PATH) as f:
    labels = json.load(f)

print("✅ AI model and labels loaded successfully!")

# 3. Define the prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read the image file uploaded by the user
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')

    # Preprocess the image to match the model's requirements
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    # Make a prediction
    predictions = model.predict(image_array)
    
    # --- THE FIX IS HERE ---
    # This line was missing. It finds the index of the best prediction.
    top_prediction_index = np.argmax(predictions[0])
    # -----------------------
    
    confidence = round(100 * predictions[0][top_prediction_index])
    label = labels[top_prediction_index]

    # Return the result as JSON
    return {"label": label, "confidence": confidence}