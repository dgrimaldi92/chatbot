import asyncio
import sys

import anyio
import orjson
from loguru import logger

from pipeline.chunking.main import spawn_chunks
from pipeline.vector_search.main import Transformer
from pipeline.web_search.main import WebSearch


async def main(query: str) -> None:
    web_search_instance = WebSearch(query)

    web_results = await web_search_instance.run()
    chunks = [
        {"text": chunk, "url": doc.url}
        for doc in web_results
        for chunk in spawn_chunks(doc.content)
    ]

    result = Transformer([chunk.get("text") for chunk in chunks], query).run()

    data = orjson.dumps(
        {
            "chunks": [
                {
                    "sentence": chunks[idx].get("text"),
                    "url": chunks[idx].get("url"),
                    "score": f"{score:.4f}",
                }
                for idx, score in result
            ],
        },
    )

    async with await anyio.open_file("./pipeline/scripts/search.json", "wb") as f:
        await f.write(data)
    # web_search_instance.remove_crawler_data()
    return data


if __name__ == "__main__":
    res = None

    if len(sys.argv) > 1:
        res = asyncio.run(main(sys.argv[1]))  # noqa: T201
        sys.stdout.write(
            res.decode(),
        )
        sys.stdout.flush()
    else:
        logger.error("No parameter provided.")

    # sys.stdout.write(res.decode())
    # print(res)
    # asyncio.run(main("what are the last treatments in sclerosis multiple in 2025"))
    # asyncio.run(main("quali sono ultimi trattamenti sclerosi multipla in 2025"))
