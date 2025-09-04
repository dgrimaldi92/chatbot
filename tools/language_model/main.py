import time

from grpclib.server import Server, Stream
from grpclib.utils import graceful_exit
from loguru import logger

from protos.llm_service_grpc import LLMBase
from protos.post_text_request_pb2 import GenerateRequest
from protos.post_text_response_pb2 import GenerateResponse
from protos.prompt_pb2 import Prompt
from protos.role_pb2 import Role
from service import Generator
from src.service import service
from utils.logger import setup_logger

# Initialize the logger
setup_logger()


class LLMService(LLMBase):
    async def GenerateText(
        self,
        stream: Stream[GenerateRequest, GenerateResponse],
    ) -> None:
        req = await stream.recv_message()
        logger.info(req)
        if req is None:
            return
        start_time = time.time()
        response = Generator(req.type).text_generator(req.prompt.content)
        logger.info(f"response | Generated in {time.time() - start_time} seconds")

        await stream.send_message(
            GenerateResponse(
                prompt=Prompt(
                    content=response,
                    role=Role.ROLE_ASSISTANT,
                ),
            ),
        )


async def main(*, host: str = "127.0.0.1", port: int = 50051) -> None:
    server = Server([LLMService()])
    # Note: graceful_exit isn't supported in Windows
    with graceful_exit([server]):
        await server.start(host, port)
        logger.info(f"Serving  on {host}:{port}")
        await server.wait_closed()


if __name__ == "__main__":
    import asyncio

    service()

    # asyncio.run(main())
