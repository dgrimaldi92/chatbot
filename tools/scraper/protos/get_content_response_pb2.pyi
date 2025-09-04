import scrape_pb2 as _scrape_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class GetScrapedResponse(_message.Message):
    __slots__ = ("scrape",)
    SCRAPE_FIELD_NUMBER: _ClassVar[int]
    scrape: _containers.RepeatedCompositeFieldContainer[_scrape_pb2.Scrape]
    def __init__(self, scrape: _Optional[_Iterable[_Union[_scrape_pb2.Scrape, _Mapping]]] = ...) -> None: ...
