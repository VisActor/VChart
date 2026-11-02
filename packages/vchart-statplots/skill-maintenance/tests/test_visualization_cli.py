import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from _paths import SKILL

class CliTests(unittest.TestCase):
    def test_copied_skill_runs_outside_repo_and_replays_without_source(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);copy=root/'skill';shutil.copytree(SKILL,copy,ignore=shutil.ignore_patterns('__pycache__'))
            self.assertFalse((copy/'tests').exists())
            self.assertFalse((copy/'references/statplots/manifest.json').exists())
            self.assertFalse((copy/'references/statplots/package.json').exists())
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
            version=json.loads((copy/'release.json').read_text())['version']
            self.assertIn(f'vchart@{version}/build/index.min.js',page)
            self.assertIn(f'vchart-statplots@{version}/build/index.min.js',page)
            data=json.loads((root/'replay/visualization.data.json').read_text())
            self.assertEqual(data['libraries'],{'vchart':version,'statplots':version})
            self.assertNotIn(str(SKILL),page)
    def test_release_change_requires_sync_and_propagates_to_html_and_data(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);copy=root/'skill';shutil.copytree(SKILL,copy,ignore=shutil.ignore_patterns('__pycache__'))
            (copy/'release.json').write_text(json.dumps({'version':'9.9.9-test.0'}))
            request={'version':1,'title':'版本传播','charts':[{'id':'p','source':{'label':'测试数据'},
                     'spec':{'type':'histogram','data':[{'value':0},{'value':2}]}}]}
            (root/'request.json').write_text(json.dumps(request))
            cmd=[sys.executable,str(copy/'scripts/generate_visualization.py'),
                 '--request',str(root/'request.json'),'--output',str(root/'out')]
            run=subprocess.run(cmd,cwd='/',capture_output=True,text=True)
            self.assertNotEqual(run.returncode,0)
            self.assertIn('完整技能包',run.stderr)
            self.assertIn(str(copy/'release.json'),run.stderr)
            self.assertFalse((root/'out').exists())
            snapshot_path=copy/'references/statplots/snapshot.json'
            snapshot_path.write_text(json.dumps({'version':'9.9.9-test.0'}))
            run=subprocess.run(cmd,cwd='/',capture_output=True,text=True)
            self.assertEqual(run.returncode,0,run.stderr)
            page=(root/'out/visualization.html').read_text()
            self.assertIn('vchart@9.9.9-test.0/build/index.min.js',page)
            self.assertIn('vchart-statplots@9.9.9-test.0/build/index.min.js',page)
            data=json.loads((root/'out/visualization.data.json').read_text())
            self.assertEqual(data['libraries'],{'vchart':'9.9.9-test.0','statplots':'9.9.9-test.0'})
    def test_invalid_or_missing_snapshot_never_generates_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);copy=root/'skill';shutil.copytree(SKILL,copy,ignore=shutil.ignore_patterns('__pycache__'))
            (root/'request.json').write_text(json.dumps({'version':1,'title':'快照错误','charts':[
                {'id':'p','source':{'label':'测试数据'},'spec':{'type':'histogram','data':[]}}]}))
            cmd=[sys.executable,str(copy/'scripts/generate_visualization.py'),
                 '--request',str(root/'request.json'),'--output',str(root/'out')]
            snapshot=copy/'references/statplots/snapshot.json'
            for content in ['{',json.dumps({'version':'9.9.9-test.0'})]:
                snapshot.write_text(content)
                run=subprocess.run(cmd,cwd='/',capture_output=True,text=True)
                self.assertNotEqual(run.returncode,0)
                self.assertNotIn('Traceback',run.stderr)
                self.assertFalse((root/'out').exists())
            snapshot.unlink()
            run=subprocess.run(cmd,cwd='/',capture_output=True,text=True)
            self.assertEqual(run.returncode,3,run.stderr)
            self.assertIn('snapshot.json',run.stderr)
            self.assertFalse((root/'out').exists())
    def test_invalid_or_missing_release_never_generates_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);copy=root/'skill';shutil.copytree(SKILL,copy,ignore=shutil.ignore_patterns('__pycache__'))
            (root/'request.json').write_text(json.dumps({'version':1,'title':'配置错误','charts':[
                {'id':'p','source':{'label':'测试数据'},'spec':{'type':'histogram','data':[]}}]}))
            cmd=[sys.executable,str(copy/'scripts/generate_visualization.py'),
                 '--request',str(root/'request.json'),'--output',str(root/'out')]
            for release in [{'version':'latest'},{'version':'^2.0.0'},{}]:
                with self.subTest(release=release):
                    (copy/'release.json').write_text(json.dumps(release))
                    run=subprocess.run(cmd,cwd='/',capture_output=True,text=True)
                    self.assertNotEqual(run.returncode,0)
                    self.assertIn('release.json',run.stderr)
                    self.assertNotIn('Traceback',run.stderr)
                    self.assertFalse((root/'out').exists())
            (copy/'release.json').unlink()
            run=subprocess.run(cmd,cwd='/',capture_output=True,text=True)
            self.assertEqual(run.returncode,3,run.stderr)
            self.assertIn('release.json',run.stderr)
            self.assertNotIn('Traceback',run.stderr)
            self.assertFalse((root/'out').exists())
    def test_input_and_output_failures_have_distinct_exit_codes(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);p=root/'request.json';p.write_text('{"version":99}')
            cmd=[sys.executable,str(SKILL/'scripts/generate_visualization.py'),'--request',str(p),'--output',str(root/'out')]
            self.assertEqual(subprocess.run(cmd,capture_output=True).returncode,2)
            p.write_text(json.dumps({'version':1,'title':'图','charts':[{'id':'p','source':{'label':'结果'},'spec':{'type':'histogram','data':[]}}]}))
            (root/'out').mkdir()
            self.assertEqual(subprocess.run(cmd,capture_output=True).returncode,3)
if __name__=='__main__':unittest.main()
