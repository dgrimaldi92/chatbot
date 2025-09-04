import logging
import sys
from functools import partialmethod
from typing import TYPE_CHECKING

import orjson
from loguru import logger

if TYPE_CHECKING:
    from loguru import Message


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        # Get corresponding Loguru level if it exists.
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message.
        frame, depth = sys._getframe(6), 6  # noqa: SLF001
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level,
            record.getMessage(),
        )


def index_sink(message: "Message") -> None:
    """
    Custom Loguru sink that sends log records to an Elasticsearch index called 'sfs-pim'
    """
    record = message.record

    # Extract log details from the record.
    logger_name = record.get("name", "")
    level = record.get("level", {}).no
    file = record.get("file", {}).path

    line = record.get("line", "")
    message_text = record.get("message", "")
    time_obj = record.get("time")
    time_str = time_obj.isoformat() if hasattr(time_obj, "isoformat") else str(time_obj)

    exception = record.get("exception")
    exception_str = orjson.dumps(exception) if exception else None

    return {
        "logger_name": logger_name,
        "level": level,
        "file": file,
        "line": line,
        "message": message_text,
        "time": time_str,
        "exception": exception_str,
    }


def setup_logger() -> None:
    logger.remove()
    log_level = "DEBUG"
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "  # Log level
        "<magenta>{module}.{function}</magenta>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"  # Message (color-coded)
        "{exception}"  # Exception if present
    )

    logger.add(
        sys.stdout,
        level="DEBUG",
        format=log_format,
        colorize=True,
        backtrace=True,
        diagnose=True,
    )
    logger.add(index_sink, level=log_level, backtrace=True, diagnose=True)

    logger.level("STATISTIC", no=35)
    logger.__class__.statistic = partialmethod(logger.__class__.log, "STATISTIC")


# Set up standard Python logging to use InterceptHandler
standard_logger = logging.getLogger(__name__)
standard_logger.addHandler(InterceptHandler())
standard_logger.setLevel(logging.DEBUG)
