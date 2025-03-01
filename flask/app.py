from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os
import io

app = Flask(_name_)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = "./models/efficientnetb3-HR-Detection.h5"

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the Keras model
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    model.summary()
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

# Define class labels (modify as per your dataset)
class_labels = [0, 1, 2]

# Image preprocessing function
def preprocess_image(image):
    image = image.resize((224, 224))  # Resize to match model input size
    image = np.array(image) / 255.0  # Normalize
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        # Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(input_tensor)
        probabilities = predictions[0]  # Assuming batch size = 1
        predicted_class = np.argmax(probabilities)

        # Prepare response
        result = {
            'predicted_class': class_labels[predicted_class],
            'probabilities': {
                class_labels[i]: float(prob) for i, prob in enumerate(probabilities)
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'status': 'Server is running'})

if _name_ == '_main_':
    if model is None:
        print("Error: Could not load the model. Please check the model path and format.")
    else:
        app.run(debug=True, port=5000)