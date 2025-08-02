# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "asyncio",
#     "crawl4ai",
#     "orjson",
# ]
# ///
from crawl4ai import AsyncWebCrawler, AdaptiveCrawler
import asyncio
import orjson


async def main():
    async with AsyncWebCrawler() as crawler:
        # Create an adaptive crawler
        adaptive = AdaptiveCrawler(crawler)

        print("hello")

        # Start crawling with a query
        result = await adaptive.digest(
            start_url="https://duckduckgo.com/?t=h_&q=best+medicine+llm",
            query="best medicine llm",
        )
        print(result)

        # View statistics
        adaptive.print_stats()

        elements = []

        # Get the most relevant content
        relevant_pages = adaptive.get_relevant_content(top_k=5)
        for page in relevant_pages:
            elements.append(f"- {page['url']} (score: {page['score']:.2f})")
            print(f"- {page['url']} (score: {page['score']:.2f})")

        with open("sample.json", "w") as f:
            f.write(orjson.dumps(dict(result=elements)).decode("utf-8"))
        return elements


asyncio.run(main())
