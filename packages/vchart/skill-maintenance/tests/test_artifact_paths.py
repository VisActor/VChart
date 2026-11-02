from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[4]
SCRIPT_DIR = REPO_ROOT / "skills" / "vchart-development-assistant" / "scripts"


def command(script: str) -> list[str]:
    args = [sys.executable, str(SCRIPT_DIR / script)]
    if script == "generate_diagnosis_react_html.py":
        args += ["--problem-code", "<VChart />", "--problem-title", "Chart issue", "--cause", "Invalid data"]
    return args


@pytest.mark.parametrize("script", ["generate_demo_html.py", "generate_diagnosis_html.py", "generate_diagnosis_react_html.py"])
@pytest.mark.parametrize("mode", ["absolute", "relative", "parent", "default", "output"])
def test_generators_report_the_actual_file_independently_of_host_environment(
    tmp_path: Path, script: str, mode: str
) -> None:
    cwd = tmp_path / "working directory"
    cwd.mkdir()
    host_root = tmp_path / "unrelated-host-root"
    filename = {"generate_demo_html.py": "demo.html", "generate_diagnosis_html.py": "diagnosis.html", "generate_diagnosis_react_html.py": "diagnosis_react.html"}[script]
    if mode == "absolute":
        directory = tmp_path / "absolute output"
        args = ["--output-dir", str(directory)]
        expected = directory / filename
    elif mode in {"relative", "parent"}:
        directory = "relative output" if mode == "relative" else "../sibling output"
        args = ["--output-dir", directory]
        expected = (cwd / directory / filename).resolve()
    elif mode == "output":
        args = ["--output", "custom/result.html"]
        expected = cwd / "custom/result.html"
    else:
        args = []
        expected = cwd / "output" / filename

    result = subprocess.run(
        [*command(script), *args],
        cwd=cwd,
        env={**os.environ, "AGENTS_DIR": str(host_root)},
        capture_output=True,
        text=True,
        check=True,
    )

    assert result.stdout.strip() == str(expected)
    assert expected.is_file()
    assert not host_root.exists()


@pytest.mark.parametrize("script", ["generate_demo_html.py", "generate_diagnosis_html.py", "generate_diagnosis_react_html.py"])
@pytest.mark.parametrize("flag", ["--output-dir", "--output"])
@pytest.mark.parametrize("value", ["", "   "])
def test_explicit_empty_path_fails_without_writing_fallback(
    tmp_path: Path, script: str, flag: str, value: str
) -> None:
    result = subprocess.run(
        [*command(script), flag, value],
        cwd=tmp_path,
        capture_output=True,
        text=True,
    )

    assert result.returncode != 0
    assert f"{flag} must not be empty" in result.stderr
    assert not list(tmp_path.iterdir())
