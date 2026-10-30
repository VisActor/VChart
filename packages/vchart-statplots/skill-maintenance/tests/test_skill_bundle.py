"""Validate the whole distributed skill, including paths outside statplots resources."""
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from urllib.parse import unquote, urlsplit
from _paths import REPOSITORY, SKILL


class SkillBundleTests(unittest.TestCase):
    def test_usage_only_layout_and_local_markdown_links(self):
        ignored = {'__pycache__', '.DS_Store'}
        self.assertEqual({p.name for p in SKILL.iterdir()} - ignored,
                         {'SKILL.md', 'release.json', 'agents', 'assets', 'examples', 'references', 'scripts'})
        links = 0
        for file in SKILL.rglob('*'):
            if ignored.intersection(file.relative_to(SKILL).parts):
                continue
            self.assertFalse(file.is_symlink(), str(file))
            if not file.is_file():
                continue
            self.assertNotIn(file.name, {'manifest.json', 'package.json'}, str(file))
            if file.suffix == '.json':
                json.loads(file.read_text(encoding='utf-8'))
            if file.suffix != '.md':
                continue
            for target in re.findall(r'\]\(([^)]+)\)', file.read_text(encoding='utf-8')):
                url = urlsplit(target)
                self.assertFalse(url.scheme or url.netloc, f'{file}: {target}')
                local = (file.parent / unquote(url.path)).resolve() if url.path else file
                self.assertTrue(local.is_relative_to(SKILL), f'{file}: {target}')
                self.assertTrue(local.is_file(), f'{file}: {target}')
                if url.fragment:
                    headings = re.findall(r'^#+\s+(.+)$', local.read_text(encoding='utf-8'), re.M)
                    anchors = {re.sub(r'[^\w\- ]', '', heading.lower()).replace(' ', '-') for heading in headings}
                    self.assertIn(unquote(url.fragment), anchors, f'{file}: {target}')
                links += 1
        self.assertGreater(links, 80)

    def test_copied_examples_need_only_stdlib_without_repository_access(self):
        # Isolate site packages and PATH; reject original-repository file reads,
        # networking and subprocesses inside the copied generator itself.
        runner = '''
import os, runpy, sys
repository, script, request, output = sys.argv[1:]
def audit(event, args):
    if event == 'open' and isinstance(args[0], (str, bytes)):
        target = os.path.realpath(os.fsdecode(args[0]))
        if target == repository or target.startswith(repository + os.sep):
            raise RuntimeError('Original repository access: ' + target)
    if event.startswith(('socket.', 'subprocess.')) or event == 'os.system':
        raise RuntimeError('Unexpected external dependency: ' + event)
sys.addaudithook(audit)
sys.path.insert(0, os.path.dirname(script))
sys.argv = [script, '--request', request, '--output', output]
runpy.run_path(script, run_name='__main__')
'''
        with tempfile.TemporaryDirectory(prefix='dsv-independent-') as temp:
            root = Path(temp)
            copied = root / '独立 skill'
            shutil.copytree(SKILL, copied, ignore=shutil.ignore_patterns('__pycache__', '.DS_Store'))
            script = copied / 'scripts/generate_visualization.py'
            env = {'PATH': '', 'HOME': temp, 'TMPDIR': temp}
            def generate(request, output):
                result = subprocess.run([sys.executable, '-I', '-S', '-B', '-c', runner,
                                         str(REPOSITORY), str(script), str(request), str(output)],
                                        cwd='/', env=env, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                return json.loads((output / 'visualization.data.json').read_text(encoding='utf-8'))
            names = ['distribution', 'comparison', 'relationships', 'quality', 'external', 'interactive']
            for name in names:
                with self.subTest(example=name):
                    output = root / name
                    data = generate(copied / 'examples' / f'{name}.json', output)
                    self.assertTrue(data['charts'])
            (copied / 'examples/observations.csv').unlink()
            for name in names:
                with self.subTest(replay=name):
                    original = json.loads((root / name / 'visualization.data.json').read_text(encoding='utf-8'))
                    replay = generate(root / name / 'visualization.request.json', root / f'{name}-replay')
                    self.assertEqual(replay['charts'], original['charts'])
                    if original['dataset']:
                        self.assertEqual(replay['dataset']['rows'], original['dataset']['rows'])
            self.assertFalse(list(copied.rglob('__pycache__')))


if __name__ == '__main__':
    unittest.main()
