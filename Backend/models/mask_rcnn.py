import torch
from torchvision import transforms
from PIL import Image
import numpy as np
import os
import uuid
from torchvision.utils import save_image

# Load TorchScript model once
model_path = os.path.join(os.path.dirname(__file__), "deeplabv3_traced.pt")
model = torch.jit.load(model_path, map_location="cpu")
model.eval()

# ImageNet normalization
preprocess = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# Color map for segmentation mask (class index to color)
def decode_segmap(mask):
    colormap = np.array([
        [0, 0, 0],        # 0: background
        [128, 0, 0],      # 1
        [0, 128, 0],      # 2
        [128, 128, 0],    # 3
        [0, 0, 128],      # 4
        [128, 0, 128],    # 5
        [0, 128, 128],    # 6
        [128, 128, 128]   # 7
    ])
    return colormap[mask % len(colormap)]

# Main callable function for Flask
def segment_image(image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        pred_mask = torch.argmax(output.squeeze(0), dim=0).cpu().numpy()

    # Decode and save color mask
    decoded_mask = decode_segmap(pred_mask)
    mask_image = Image.fromarray(decoded_mask.astype(np.uint8))

    output_filename = f"segmented_{uuid.uuid4().hex[:8]}.png"
    output_path = os.path.join("static/outputs", output_filename)
    mask_image.save(output_path)

    return output_path