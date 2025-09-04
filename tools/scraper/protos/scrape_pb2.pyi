from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class Scrape(_message.Message):
    __slots__ = ("content", "url")
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    content: str
    url: str
    def __init__(self, content: _Optional[str] = ..., url: _Optional[str] = ...) -> None: ...
