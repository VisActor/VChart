import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
SKILL=Path(__file__).resolve().parents[1]

class CliTests(unittest.TestCase):
    def test_copied_skill_runs_outside_repo_and_replays_without_source(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);copy=root/'skill';shutil.copytree(SKILL,copy,ignore=shutil.ignore_patterns('__pycache__'))
            (root/'raw.csv').write_text('id,x\n001,0\n002,2\n')
            request={'version':1,'title':'真实分布','dataset':{'source':{'path':'raw.csv','format':'csv'},'idColumn':'id',
                     'columns':[{'name':'id','type':'string'},{'name':'x','type':'number'}]},
                     'charts':[{'id':'p','binding':{'type':'histogram','fields':{'value':'x'}}}]}
            (root/'request.json').write_text(json.dumps(request))
            script=copy/'scripts/generate_visualization.py'
            run=subprocess.run([sys.executable,str(script),'--request',str(root/'request.json'),'--output',str(root/'out')],cwd='/',capture_output=True,text=True)
            self.assertEqual(run.returncode,0,run.stderr)
            (root/'raw.csv').unlink()
            replay=subprocess.run([sys.executable,str(script),'--request',str(root/'out/visualization.request.json'),'--output',str(root/'replay')],cwd='/',capture_output=True,text=True)
            self.assertEqual(replay.returncode,0,replay.stderr)
            page=(root/'replay/visualization.html').read_text()
            self.assertIn('vchart@2.1.8-alpha.0/build/index.min.js',page)
            self.assertIn('vchart-statplots@2.1.8-alpha.0/build/index.min.js',page)
            self.assertNotIn(str(SKILL),page)
    def test_input_and_output_failures_have_distinct_exit_codes(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);p=root/'request.json';p.write_text('{"version":99}')
            cmd=[sys.executable,str(SKILL/'scripts/generate_visualization.py'),'--request',str(p),'--output',str(root/'out')]
            self.assertEqual(subprocess.run(cmd,capture_output=True).returncode,2)
            p.write_text(json.dumps({'version':1,'title':'图','charts':[{'id':'p','source':{'label':'结果'},'spec':{'type':'histogram','data':[]}}]}))
            (root/'out').mkdir()
            self.assertEqual(subprocess.run(cmd,capture_output=True).returncode,3)
if __name__=='__main__':unittest.main()
