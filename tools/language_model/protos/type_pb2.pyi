from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from typing import ClassVar as _ClassVar

DESCRIPTOR: _descriptor.FileDescriptor

class ProtoType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    TYPE_UNSPECIFIED: _ClassVar[ProtoType]
    TYPE_MESSAGE: _ClassVar[ProtoType]
    TYPE_SEARCH: _ClassVar[ProtoType]
    TYPE_THINK: _ClassVar[ProtoType]
TYPE_UNSPECIFIED: ProtoType
TYPE_MESSAGE: ProtoType
TYPE_SEARCH: ProtoType
TYPE_THINK: ProtoType
