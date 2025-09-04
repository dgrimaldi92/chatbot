#!/usr/bin/env python3
"""
Patch generated protobuf python files so imports use a package prefix
and still expose the short module name the generated code expects.

Usage:
  # auto-detect typical generated dirs (tools/*/protos and ./protos)
  python3 tools/patch_pb_imports.py

  # specify directories explicitly
  python3 tools/patch_pb_imports.py tools/scraper/protos tools/language_model/protos

  # use different prefix (default: protos)
  python3 tools/patch_pb_imports.py --prefix=my.generated.protos tools/scraper/protos

  # show changes without writing
  python3 tools/patch_pb_imports.py --dry-run tools/scraper/protos

  # also fix "from <mod> import X" lines
  python3 tools/patch_pb_imports.py --fix-from tools/scraper/protos
"""

from __future__ import annotations
import argparse
import pathlib
import re
import sys
from typing import Iterable, List, Tuple

# Regex to match import lines that mention a _pb2 (with optional _grpc suffix)
RE_IMPORT = re.compile(
    r"^(?P<indent>\s*)import\s+(?P<mod>[A-Za-z_][A-Za-z0-9_\.]*_pb2(?:_grpc)?)"  # module, maybe with dots
    r"(?:\s+as\s+(?P<alias>[A-Za-z0-9_]+))?\s*$",
    re.M,
)

# Regex to match "from X import ..." lines
RE_FROM = re.compile(
    r"^(?P<indent>\s*)from\s+(?P<mod>[A-Za-z_][A-Za-z0-9_\.]*_pb2(?:_grpc)?)\s+import\s+(?P<rest>.+)$",
    re.M,
)


def find_default_dirs() -> List[pathlib.Path]:
    """Find likely generated proto dirs: ./protos and tools/*/protos"""
    cwd = pathlib.Path.cwd()
    candidates = []
    root_protos = cwd / "protos"
    if root_protos.exists():
        candidates.append(root_protos.resolve())
    for p in cwd.glob("tools/*/protos"):
        if p.is_dir():
            candidates.append(p.resolve())
    # also include nested tools (language_model/protos etc)
    for p in cwd.glob("tools/**/protos"):
        if p.is_dir() and p.resolve() not in candidates:
            candidates.append(p.resolve())
    return candidates


def collect_py_files(dirs: Iterable[pathlib.Path]) -> List[pathlib.Path]:
    files = []
    for d in dirs:
        if not d.exists():
            continue
        for p in sorted(d.rglob("*.py")):
            files.append(p)
    return files


def shortname_from_mod(mod: str) -> str:
    """Return the last path segment (module shortname)."""
    return mod.split(".")[-1]


def patch_text(text: str, prefix: str, fix_from: bool) -> Tuple[str, List[str]]:
    """
    Return (new_text, list_of_changes).
    Changes are human-readable descriptions (one per replacement).
    """
    changes = []

    def import_repl(m: re.Match) -> str:
        indent = m.group("indent") or ""
        mod = m.group(
            "mod"
        )  # maybe 'foo_pb2' or 'protos.foo_pb2' or 'tools.x.protos.foo_pb2'
        alias = m.group("alias")
        desired_short = shortname_from_mod(mod)  # e.g. 'foo_pb2'
        # Build full_module: if mod already starts with prefix + '.', keep it,
        # otherwise prefix it.
        if mod.startswith(prefix + "."):
            full_mod = mod
        else:
            # if mod contains dots but not prefix, assume last segment is shortname
            full_mod = f"{prefix}.{desired_short}"
        # desired alias is the short module name (no leading underscore)
        desired_alias = desired_short.lstrip("_")
        # If the import already matches exactly the desired line, return unchanged
        desired_line = f"{indent}import {full_mod} as {desired_alias}"
        # If alias is present and equals desired_alias and full_mod equals mod (or mod had prefix), keep original
        # But to be idempotent, we will always produce desired_line
        if m.group(0).strip() == desired_line.strip():
            return m.group(0)
        changes.append(f"IMPORT: '{m.group(0).strip()}' -> '{desired_line.strip()}'")
        return desired_line

    new = RE_IMPORT.sub(import_repl, text)

    if fix_from:

        def from_repl(m: re.Match) -> str:
            indent = m.group("indent") or ""
            mod = m.group("mod")
            rest = m.group("rest")
            desired_short = shortname_from_mod(mod)
            if mod.startswith(prefix + "."):
                full_mod = mod
            else:
                full_mod = f"{prefix}.{desired_short}"
            desired_line = f"{indent}from {full_mod} import {rest}"
            if m.group(0).strip() == desired_line.strip():
                return m.group(0)
            changes.append(f"FROM: '{m.group(0).strip()}' -> '{desired_line.strip()}'")
            return desired_line

        new = RE_FROM.sub(from_repl, new)

    return new, changes


def apply_patches(
    files: Iterable[pathlib.Path], prefix: str, dry_run: bool, fix_from: bool
) -> int:
    total = 0
    for p in files:
        txt = p.read_text()
        new_txt, changes = patch_text(txt, prefix, fix_from)
        if changes:
            if not dry_run:
                p.write_text(new_txt)
            total += 1
    return total


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser(prog="patch_pb_imports.py")
    ap.add_argument(
        "dirs", nargs="*", help="Directories to scan (defaults to auto-detect)"
    )
    ap.add_argument(
        "--prefix",
        default="protos",
        help="Package prefix to ensure (default: 'protos')",
    )
    ap.add_argument(
        "--dry-run", action="store_true", help="Show changes but do not write files"
    )
    ap.add_argument(
        "--fix-from",
        action="store_true",
        help="Also rewrite 'from <mod> import ...' lines to include prefix",
    )
    args = ap.parse_args(argv)

    if args.dirs:
        dirs = [pathlib.Path(d) for d in args.dirs]
    else:
        dirs = find_default_dirs()
        if not dirs:
            return 2

    dirs = [d.resolve() for d in dirs]
    files = collect_py_files(dirs)
    if not files:
        return 0

    apply_patches(files, args.prefix, args.dry_run, args.fix_from)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
