import asyncio

from bs4 import BeautifulSoup
from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CacheMode,
    CrawlerRunConfig,
    CrawlResult,
)
from loguru import logger
from trafilatura import extract
from trafilatura.downloads import (
    add_to_compressed_dict,
    buffered_downloads,
    load_download_buffer,
)
from trafilatura.settings import Extractor

from protos.scrape_pb2 import Scrape
from utils.flatten import flatten_concatenation


class WebSearch:
    def __init__(self, links: list[str], query: str) -> None:
        # Json file path for storing adaptive crawling info
        self.query = query
        self.links = links
        self.crawler = AsyncWebCrawler(config=BrowserConfig(verbose=True))

    @staticmethod
    def get_pages_content(urls: list[str]) -> list[Scrape] | None:
        # number of threads to use
        threads = 4

        # converted the input list to an internal format
        url_store = add_to_compressed_dict(urls)

        # processing loop
        while url_store.done is False:
            bufferlist, url_store = load_download_buffer(url_store, sleep_time=5)
            # process downloads
            return [
                Scrape(
                    url=result[0],
                    content=f"{result[1]} \n[Link_URL #{index}]{result[0]} \n\n",
                )
                for index, result in enumerate(
                    buffered_downloads(
                        bufferlist,
                        threads,
                        Extractor(
                            output_format="markdown",
                            fast=True,
                            comments=False,
                            formatting=True,
                        ),
                    ),
                )
                if (
                    (
                        content := extract(
                            result[1],
                            output_format="html",
                            # include_comments=False,
                            # deduplicate=True,
                            url=result[0],
                            include_formatting=True,
                            # fast=True,
                            # include_formatting=False,
                        )
                    )
                    is not None
                )
            ]
        return None

    async def simple_crawler(
        self,
        num_search_result: int,
        search_query: str,
    ) -> list[str]:
        result: CrawlResult
        logger.info(
            f"https://www.google.com/search?q={search_query}&num={num_search_result}",
        )
        result = await self.crawler.arun(
            url=f"https://www.google.com/search?q={search_query}&num={num_search_result}",
            config=CrawlerRunConfig(
                # Content filtering
                word_count_threshold=10,
                excluded_tags=["form", "header"],
                # Cache control
                cache_mode=CacheMode.ENABLED,
                verbose=False,
                exclude_social_media_links=True,
            ),
        )

        if result.success:
            return [
                link.get("href")
                for link in result.links["external"]
                if not link.get("href").startswith("https://www.youtube")
            ]

        logger.error(f"Search crawl failed: {result.error_message}")
        raise (f"Search crawl failed: {result.error_message}")

    async def run(self, num_search_result: int = 1) -> list[Scrape]:
        # List tasks "fetch_data" with a specific URL
        tasks = [self.simple_crawler(num_search_result, url) for url in self.links]

        # un the tasks concurrently and gather their results
        scraped_results = await asyncio.gather(*tasks)

        return self.get_pages_content(flatten_concatenation(scraped_results))


if __name__ == "__main__":
    import time

    start_time = time.time()
    web_search = WebSearch(
        [
            "last treatmens in multiple sclerosis 2025 site:wikipedia.org",
            "last treatmens in multiple sclerosis 2025 filetype:pdf",
            'last treatmens in multiple sclerosis 2025 intitle:"research papers"',
            'last treatmens in multiple sclerosis 2025 "clinical trials"',
        ],
        "last treatments in multiple sclerosis in 2025",
    )
    res = asyncio.run(web_search.run())
    logger.info(f"{res} | Generated in {time.time() - start_time} seconds")
