from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from models.captioning import generate_caption
from models.mask_rcnn import segment_image

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

# === Folder Paths ===
UPLOAD_FOLDER = 'static/uploads/'
OUTPUT_FOLDER = 'static/outputs/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "Flask Backend for Image Captioning and Segmentation is running."

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Filename is empty'}), 400

    # Save uploaded file
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    try:
        # 🔍 Run segmentation
        segmented_path = segment_image(save_path)

        # 🧠 Generate caption
        caption = generate_caption(save_path)

        return jsonify({
            'caption': caption,
            'segmented_image_url': f'/{segmented_path}' 
        })

    except Exception as e:
        print("[ERROR]:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
