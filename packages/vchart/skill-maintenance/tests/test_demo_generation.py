"""The actual HTML preserves source text without executing template interpolation."""
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[4] / 'skills/vchart-development-assistant/scripts' / 'generate_demo_html.py'

class DemoCodeTextTest(unittest.TestCase):
    def test_javascript_code_roundtrips_without_template_interpolation(self):
        source = "const spec = {type:'bar',data:{values:[]},label:{formatMethod: text => `值 ${text}`}};\n// </script> ${globalThis.executed = true}"
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'spec.js').write_text(source)
            subprocess.run([sys.executable, str(SCRIPT), '--spec-file', str(root / 'spec.js'), '--output', str(root / 'demo.html')], check=True, capture_output=True, cwd=root)
            html = (root / 'demo.html').read_text()
            encoded = re.search(r'const initialCode = (.*);', html).group(1)
            self.assertEqual(json.loads(encoded), source)
            self.assertNotIn('</script>', encoded)

if __name__ == '__main__':
    unittest.main()
