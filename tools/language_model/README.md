### Command to generate types
``make protos_python PROTO_DIR=protos/llm OUT_DIR=tools/language_model/protos``
``uv run python3 tools/patch_pb_imports.py``