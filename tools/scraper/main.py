import time

from grpclib.server import Server, Stream
from grpclib.utils import graceful_exit
from loguru import logger

from protos.get_content_request_pb2 import GetScrapeRequest
from protos.get_content_response_pb2 import GetScrapedResponse
from protos.scrape_service_grpc import ScraperServiceBase
from service import WebSearch
from utils.logger import setup_logger

# Initialize the logger
setup_logger()


class LLMService(ScraperServiceBase):
    async def GetScrapedText(
        self,
        stream: Stream[GetScrapeRequest, GetScrapedResponse],
    ) -> None:
        req = await stream.recv_message()
        logger.info([req.user_query, req.queries])
        start_time = time.time()
        response = await WebSearch(query=req.user_query, links=req.queries).run()
        logger.info(f"response | Generated in {time.time() - start_time} seconds")

        await stream.send_message(GetScrapedResponse(scrape=response))


async def main(*, host: str = "127.0.0.1", port: int = 50052) -> None:
    server = Server([LLMService()])
    # Note: graceful_exit isn't supported in Windows
    with graceful_exit([server]):
        await server.start(host, port)
        logger.info(f"Serving  on {host}:{port}")
        await server.wait_closed()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
