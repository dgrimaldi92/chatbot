from typing import TYPE_CHECKING

from loguru import logger
from mlx_lm import generate, load
from mlx_lm.generate import stream_generate
from torch import backends, bfloat16, cuda
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BatchEncoding,
    GenerationConfig,
    pipeline,
)

from protos.type_pb2 import ProtoType as RequestType
from utils.search_prompt import search_prompt

if TYPE_CHECKING:
    from mlx_lm.tokenizer_utils import TokenizerWrapper
    from transformers import (
        Qwen2ForCausalLM,
        Qwen2TokenizerFast,
    )


if backends.mps.is_available():
    model, tokenizer = load("mlx-community/Qwen3-8B-4bit-DWQ-053125")
elif cuda.is_available():
    model_name = "Qwen/Qwen2.5-3B-Instruct"  # "Qwen/Qwen3-8B"
    path = "./models/qwen2"
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=bfloat16,  # or "auto" or load_in_8bit=True (bitsandbytes required)
        device_map="mps",
        attn_implementation="sdpa",
    )
    tokenizer = AutoTokenizer.from_pretrained(model_name)
else:
    logger.info("cpu")  # Fallback


# model.save_pretrained "./models/qwen2")
# tokenizer.save_pretrained "./models/qwen2")


class Generator:
    def __init__(self, request_type: RequestType) -> None:
        # load the tokenizer and the model
        self.model: Qwen2ForCausalLM = model
        self.tokenizer: Qwen2TokenizerFast | TokenizerWrapper = tokenizer
        self.is_search_request = request_type == RequestType.TYPE_SEARCH
        self.is_thinking_enabled = request_type == RequestType.TYPE_THINK

    def parse_content(
        self,
        output_ids: list[str],
    ) -> str:
        return self.tokenizer.decode(
            output_ids,
            skip_special_tokens=True,
        ).strip("\n")

    def cuda_text_generator(
        self,
        text: str | list[int] | list[str] | list[list[int]] | BatchEncoding,
    ) -> str:
        model_inputs = self.tokenizer([text], return_tensors="pt").to(self.model.device)

        if self.model.can_generate() is True:
            # conduct text completion
            generated_ids = self.model.generate(
                **model_inputs,
                generation_config=GenerationConfig(
                    max_new_tokens=1024 if self.is_search_request else None,
                    # num_beams 4,  # generates 4 candidates
                    # num_return_sequences 3,  # 4
                    # do_sample True,
                    # top_k 50,  # allows controlled diversity
                    # temperature 0.7,  # smooths randomness
                    # repetition_penalty 1.2,
                    # length_penalty 0.8,  # encourages shorter sequences
                    # renormalize_logits True,
                    # optional grouping:num_beam_groups=4,diversity_penalty=0.6
                    cache_implementation="quantized"
                    if str(self.model.device) != "mps:0"
                    else None,
                    cache_config={"axis-key": 1, "axis-value": 1, "backend": "hqq"}
                    if str(self.model.device) != "mps:0"
                    else None,  # {"backend": "quanto", "nbits": 4},
                ),
                # enable cache
            )
        else:
            return None

        output_ids = generated_ids[0][len(model_inputs.input_ids[0]) :].tolist()

        # parse thinking content
        if self.is_thinking_enabled:
            index = len(output_ids) - output_ids[::-1].index(151668)
            thinking_content = self.parse_content(output_ids[:index])
            logger.info(f"Thinking content {thinking_content}")
            return self.parse_content(output_ids[index:])

        index = 0
        return self.parse_content(output_ids)

    def mps_text_generator(
        self,
        text: str | list[int] | list[str] | list[list[int]] | BatchEncoding,
    ) -> str:
        return generate(
            model,
            self.tokenizer,
            prompt=text,
            verbose=True,
            max_tokens=2048,
        )

    def mps_text_stream_generator(
        self,
        text: str | list[int] | list[str] | list[list[int]] | BatchEncoding,
    ) -> str:
        return stream_generate(model, self.tokenizer, prompt=text, verbose=True)

    def text_generator(self, user_prompt: str) -> str:
        # prepare the model input
        messages = [
            {
                "role": "user",
                "content": search_prompt(user_prompt)
                if self.is_search_request
                else user_prompt,
            },
        ]

        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=self.is_thinking_enabled,  # Switches between thinking
        )

        if backends.mps.is_available():
            return self.mps_text_generator(text)

        return self.cuda_text_generator(text)

    def text_generator_pipe(self, prompt: str) -> str:
        pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
        )
        return pipe(prompt, max_new_tokens=60)[0]["generated_text"][len(prompt) :]


if __name__ == "__main__":
    import time

    start_time = time.time()
    res = Generator(request_type=RequestType.TYPE_MESSAGE).text_generator(
        "esistono lettere di referenze per medici in italia, quando un medico vuole cambiare ospedae. O in italia con i concorsi pubblici non servono più",
    )
    logger.info(f"{res} | Generated in {time.time() - start_time} seconds")
