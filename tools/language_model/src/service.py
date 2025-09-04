from litgpt import LLM


def service() -> None:
    llm = LLM.load("Qwen/Qwen3-0.6B-Base")
    response = llm.generate("Hello, who are you?")
    print(response)
