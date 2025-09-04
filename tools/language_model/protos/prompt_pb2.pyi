import role_pb2 as _role_pb2
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Prompt(_message.Message):
    __slots__ = ("content", "role")
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    ROLE_FIELD_NUMBER: _ClassVar[int]
    content: str
    role: _role_pb2.Role
    def __init__(self, content: _Optional[str] = ..., role: _Optional[_Union[_role_pb2.Role, str]] = ...) -> None: ...
