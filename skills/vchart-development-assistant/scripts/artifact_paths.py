from __future__ import annotations

from pathlib import Path


def resolve_output_path(
    output: str | None,
    output_dir: str | None,
    filename: str,
) -> Path:
    """Resolve ordinary filesystem paths without depending on an agent host."""
    if output_dir is not None:
        if not output_dir.strip():
            raise ValueError("--output-dir must not be empty")
        target = Path(output_dir).expanduser() / filename
    else:
        if output is not None and not output.strip():
            raise ValueError("--output must not be empty")
        target = Path(output if output is not None else f"output/{filename}").expanduser()
    return target.resolve()
