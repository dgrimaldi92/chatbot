from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from typing import ClassVar as _ClassVar

DESCRIPTOR: _descriptor.FileDescriptor

class Role(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    ROLE_UNSPECIFIED: _ClassVar[Role]
    ROLE_ASSISTANT: _ClassVar[Role]
    ROLE_USER: _ClassVar[Role]
    ROLE_SYSTEM: _ClassVar[Role]
ROLE_UNSPECIFIED: Role
ROLE_ASSISTANT: Role
ROLE_USER: Role
ROLE_SYSTEM: Role
