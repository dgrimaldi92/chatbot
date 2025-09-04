import tempfile
from pathlib import Path, PurePath

import torch
from diffusers import QwenImageEditPipeline
from pdf2image import convert_from_path
from PIL import Image

PATH = PurePath("./test.pdf")

pipeline = QwenImageEditPipeline.from_pretrained("Qwen/Qwen-Image-Edit")
pipeline.to(torch.bfloat16)
pipeline.to("cuda")
pipeline.set_progress_bar_config(disable=None)

with tempfile.TemporaryDirectory() as path:
    print(path)
    images_from_path = convert_from_path(PATH, output_folder=path)

    # This method will show image in any image viewer
    image = images_from_path[0]

    image = image.convert("RGB")
    prompt = "Change the rabbit's color to purple, with a flash light background."

    inputs = {
        "image": image,
        "prompt": prompt,
        "generator": torch.manual_seed(0),
        "true_cfg_scale": 4.0,
        "negative_prompt": " ",
        "num_inference_steps": 50,
    }

    print(inputs)
    with torch.inference_mode():
        output = pipeline(**inputs)
        output_image = output.images[0]
        output_image.save("output_image_edit.png")
