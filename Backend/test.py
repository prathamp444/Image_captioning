from models.captioning import generate_caption
from models.mask_rcnn import segment_image

image_path = "static/uploads/test.png"

print("🔍 Running inference on:", image_path)

# Run captioning
caption = generate_caption(image_path)
print("📝 Caption:", caption)

# Run segmentation
segmented_output = segment_image(image_path)
print("🖼️ Segmented image saved at:", segmented_output)
