import torch
from transformers import AutoProcessor, AutoModelForImageTextToText
from PIL import Image
import os

# Load model and processor once at startup
processor = AutoProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = AutoModelForImageTextToText.from_pretrained("Salesforce/blip-image-captioning-base")

# Move model to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Main function to generate caption
def generate_caption(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
    except Exception as e:
        print(f"[Error] Cannot open image: {e}")
        return "Unable to load image."

    try:
        inputs = processor(images=image, return_tensors="pt").to(device)
        outputs = model.generate(**inputs, max_new_tokens=50)
        caption = processor.batch_decode(outputs, skip_special_tokens=True)[0]
        return caption
    except Exception as e:
        print(f"[Error] Captioning failed: {e}")
        return "Caption generation failed."
