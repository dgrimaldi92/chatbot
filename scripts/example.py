# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "accelerate",
#     "diffusers",
#     "huggingface-hub",
#     "protobuf",
#     "torch",
#     "transformers[sentencepiece]",
# ]
# ///

token = "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"

import torch
from accelerate import Accelerator
from diffusers import FluxPipeline
from huggingface_hub import login

login(token=token)

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-dev", torch_dtype=torch.bfloat16
)
# pipe.enable_model_cpu_offload()  # save some VRAM by offloading the model to CPU. Remove this if you have enough GPU power

prompt = "A cat holding a sign that says hello world"
image = pipe(
    prompt,
    height=1024,
    width=1024,
    guidance_scale=3.5,
    num_inference_steps=50,
    max_sequence_length=512,
    generator=torch.Generator("cpu").manual_seed(0),
).images[0]
image.save("flux-dev.png")
