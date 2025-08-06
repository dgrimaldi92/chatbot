from dataclasses import dataclass

from crawl4ai import AsyncWebCrawler, CrawlResult
from loguru import logger


@dataclass
class Link:
    href: str


@dataclass
class Result:
    content: str
    score: float
    url: str


class WebSearch:
    def __init__(self, query: str) -> None:
        from crawl4ai import BrowserConfig

        # Json file path for storing adaptive crawling info
        self.state_path = "./pipeline/scripts/res.json"
        self.query = query
        self.crawler = AsyncWebCrawler(config=BrowserConfig(verbose=True))

    @staticmethod
    def clean_markdown(original_text: str) -> str:
        import re

        # --- 1. Fix literal \n to real newlines
        text = original_text.replace("\\n", "\n")
        # --- 2. Remove markdown images: ![alt](url)
        text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
        # --- 3. Remove markdown links but keep link text: [text](url) -> text
        text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
        # --- 4. Remove escaped unicode (e.g. \u2013)
        text = re.sub(r"\\u[0-9a-fA-F]{4}", "", text)
        # --- 5. Remove non-ASCII characters (e.g. —, •)
        text = re.sub(r"[^\x00-\x7F]+", "", text)
        # --- 6. Normalize whitespace and fix broken bullets
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        fixed_lines = []

        for line in lines:
            if line.startswith("*"):
                fixed_lines.append(line)
            elif re.match(r"(?i)^biotech news by", line):
                fixed_lines.append(f"* {line}")
            else:
                # Only keep if more than 4 words
                if len(line.split()) > 4:
                    fixed_lines.append(line)

        return "\n\n".join(fixed_lines)

    def remove_crawler_data(self) -> None:
        from pathlib import Path

        Path.unlink(self.state_path)

    async def adaptive_crawler(
        self,
        links: list[Link],
        top_k: int,
    ) -> list[dict[str, any]]:
        from pathlib import Path

        from crawl4ai import AdaptiveConfig, AdaptiveCrawler, CrawlState

        adaptive = AdaptiveCrawler(
            self.crawler,
            AdaptiveConfig(
                # Coverage Score
                confidence_threshold=0.85,  # Require high coverage (def: 0.8)
                max_pages=20,  # Maximum pages to crawl (def: 50)
                top_k_links=5,  # Links to follow per page (def: 5)
                # Consistency Score
                min_gain_threshold=0.04,  # Keep crawling for small gains (def: 0.1)
                state_path=self.state_path,
            ),
        )

        for link in links:
            result: CrawlState
            result: CrawlState = await adaptive.digest(
                start_url=link.href,
                query=self.query,
                resume_from=self.state_path
                if Path(self.state_path).is_file()
                else None,
            )

            # Check if query was irrelevant
            if result.metrics.get("is_irrelevant", False):
                continue

            try:
                adaptive.state.save(self.state_path)

                if adaptive.is_sufficient:
                    break
            except Exception as error:
                logger.error(f"Adaptive crawl failed: {error}")

        return adaptive.get_relevant_content(top_k)

    async def simple_crawler(self, num_search_result: int) -> None:
        from crawl4ai import CacheMode, CrawlerRunConfig

        result_links: list[Link] = []
        result: CrawlResult
        result = await self.crawler.arun(
            url=f"https://www.google.com/search?q={self.query}&num={num_search_result}",
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
            for link in result.links["external"]:
                parsed_link = Link(href=link.get("href"))

                if not parsed_link.href.startswith("https://www.youtube"):
                    result_links.append(parsed_link)
        else:
            logger.error(f"Search crawl failed: {result.error_message}")

        return result_links

    async def run(self, num_search_result: int = 6, top_k: int = 10) -> list[Result]:
        import logging

        logging.getLogger("httpx").setLevel(logging.ERROR)
        logging.getLogger("httpcore").setLevel(logging.ERROR)
        logging.getLogger("crawl4ai").setLevel(logging.ERROR)
        logging.getLogger("crawl4ai").propagate = False

        web_list = await self.simple_crawler(num_search_result)
        relevant_pages = await self.adaptive_crawler(web_list, top_k)

        return [
            Result(
                content=self.clean_markdown(page.get("content")),
                score=page.get("score"),
                url=page.get("url"),
            )
            for page in relevant_pages
        ]
