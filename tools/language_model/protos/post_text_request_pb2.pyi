import type_pb2 as _type_pb2
import prompt_pb2 as _prompt_pb2
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class GenerateRequest(_message.Message):
    __slots__ = ("type", "prompt")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    PROMPT_FIELD_NUMBER: _ClassVar[int]
    type: _type_pb2.ProtoType
    prompt: _prompt_pb2.Prompt
    def __init__(self, type: _Optional[_Union[_type_pb2.ProtoType, str]] = ..., prompt: _Optional[_Union[_prompt_pb2.Prompt, _Mapping]] = ...) -> None: ...
