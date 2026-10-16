"""验证回调代码作为编辑器文本保存，不被 HTML 的模板字符串提前执行。"""
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'generate_demo_html.py'
MODULE_SPEC = importlib.util.spec_from_file_location('generate_demo_html', SCRIPT)
generator = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(generator)


class DemoCodeTextTest(unittest.TestCase):
    def test_javascript_code_roundtrips_without_template_interpolation(self):
        # JS 回调、反引号、Unicode、反斜线和潜在插值副作用都只是代码文本。
        source = ('const spec = { label: { formatMethod: (text, datum) => '
                  '`${datum.day}: ${text}` } };\n'
                  '// 周一 ` \\ ${globalThis.executed = true}')
        escaped = generator.escape_js_string(source)
        script = ('globalThis.executed = false;\n'
                  'const initialCode = `' + escaped + '`;\n'
                  'console.log(JSON.stringify({code: initialCode, executed: globalThis.executed}));')
        result = subprocess.run(['node', '-e', script], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        actual = json.loads(result.stdout)
        self.assertEqual(actual['code'], source)
        self.assertFalse(actual['executed'])


if __name__ == '__main__':
    unittest.main()
