from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class GetScrapeRequest(_message.Message):
    __slots__ = ("queries", "user_query")
    QUERIES_FIELD_NUMBER: _ClassVar[int]
    USER_QUERY_FIELD_NUMBER: _ClassVar[int]
    queries: _containers.RepeatedScalarFieldContainer[str]
    user_query: str
    def __init__(self, queries: _Optional[_Iterable[str]] = ..., user_query: _Optional[str] = ...) -> None: ...
