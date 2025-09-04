PROTO_SRC := $(shell find $(PROTO_DIR) -name "*.proto")

.PHONY: protos clean

protos_python:
	@if [ -z "$(PROTO_DIR)" ] || [ -z "$(OUT_DIR)" ]; then \
	  echo "Error: must pass PROTO_DIR and OUT_DIR"; \
	  echo "Example: make protos PROTO_DIR=protos/scraper OUT_DIR=tools/scraper/protos"; \
	  exit 1; \
	fi
	@echo ">>> Generating Python stubs from .proto files..."
	mkdir -p $(OUT_DIR)
	python3 -m grpc_tools.protoc \
	  -I=$(PROTO_DIR) \
	  --python_out=$(OUT_DIR) \
	  --pyi_out=$(OUT_DIR) \
	  --grpclib_python_out=$(OUT_DIR) \
	  $$(find $(PROTO_DIR) -name "*.proto")
	@test -f $(OUT_DIR)/__init__.py || touch $(OUT_DIR)/__init__.py
	-ln -sfn $(PWD)/$(OUT_DIR) protos
	@python3 tools/patch_pb_imports.py $(OUT_DIR)
	@echo ">>> Done."


protos_node:
	@if [ -z "$(PROTO_DIR)" ] || [ -z "$(OUT_DIR)" ]; then \
	  echo "Error: must pass PROTO_DIR and OUT_DIR (or rely on defaults)"; exit 1; \
	fi
	@echo ">>> Generating Node stubs from .proto files..."
	@mkdir -p $(OUT_DIR)
	@NODE_FILES=$$(find "$(PROTO_DIR)" -name "*.proto" -print); \
	if [ -z "$$NODE_FILES" ]; then \
	  echo ">>> No .proto files found in $(PROTO_DIR)"; \
	else \
	  npx grpc_tools_node_protoc \
	    --js_out=import_style=commonjs:$(OUT_DIR) \
	    --ts_out=$(OUT_DIR) \
	    --grpc_out=grpc_js:$(OUT_DIR) \
	    -I="$(PROTO_DIR)" \
	    $$NODE_FILES; \
	fi
	@echo ">>> Node proto generation finished."
