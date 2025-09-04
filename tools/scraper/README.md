### Command to generate types
``make protos_python PROTO_DIR=protos/scraper OUT_DIR=tools/scraper/protos``
``uv run python3 tools/patch_pb_imports.py``