from pathlib import Path
import sys
import json
import tempfile
import unittest
from html.parser import HTMLParser
from _paths import SKILL
sys.path.insert(0,str(SKILL/'scripts'))
from visualization_io import build_payload
from visualization_html import render_html, write_outputs
ASSETS=SKILL/'assets'

class DataParser(HTMLParser):
    def __init__(self):super().__init__();self.active=False;self.data=''
    def handle_starttag(self,tag,attrs):self.active=tag=='script' and dict(attrs).get('id')=='visualization-data'
    def handle_data(self,data):
        if self.active:self.data+=data
    def handle_endtag(self,tag):
        if tag=='script':self.active=False

class HtmlTests(unittest.TestCase):
    def payload(self):
        return build_payload({'version':1,'title':'</script><script>alert(1)</script>','charts':[
          {'id':'p','source':{'label':'<b>真实结果</b>'},'spec':{'type':'histogram','data':[{'value':0},{'value':2}]}}]},Path('.'))
    def test_safe_json_and_title_roundtrip(self):
        payload=self.payload();page=render_html(payload,ASSETS)
        self.assertNotIn('</script><script>alert(1)',page)
        self.assertIn('\\u003c/script>',page)
        parser=DataParser();parser.feed(page)
        self.assertEqual(json.loads(parser.data),payload)
        payload['presentation']['details']=['provenance']
        self.assertIn('&lt;b&gt;真实结果&lt;/b&gt;',render_html(payload,ASSETS))
    def test_minimal_page_has_no_tools_or_technical_content(self):
        page=render_html(self.payload(),ASSETS)
        parser=HTMLParser()
        elements=[]
        parser.handle_starttag=lambda tag,attrs:elements.append((tag,dict(attrs)))
        parser.feed(page)
        self.assertFalse(any(tag in {'button','select','input','details','footer','h2'} for tag,attrs in elements))
        self.assertFalse(any('toolbar' in attrs.get('class','').split() for tag,attrs in elements))
        self.assertEqual(sum(tag=='h1' for tag,attrs in elements),1)
    def test_only_requested_actions_and_matrix_units_are_created(self):
        payload=build_payload({'version':1,'title':'关系','presentation':{'actions':['exportPNG']},
          'dataset':{'source':{'records':[{'x':0,'y':1},{'x':1,'y':2}]},'columns':[
            {'name':'x','type':'number','label':'年龄','unit':'岁'},{'name':'y','type':'number','label':'收入','unit':'元'}]},
          'charts':[{'id':'pair','binding':{'type':'pairPlot','fields':{'variables':['x','y']}}}]},Path('.'))
        page=render_html(payload,ASSETS)
        parser=HTMLParser();buttons=[]
        parser.handle_starttag=lambda tag,attrs:buttons.append(dict(attrs)) if tag=='button' else None
        parser.feed(page)
        self.assertEqual(buttons,[{'type':'button','data-png':'pair','disabled':None}])
        self.assertIn('年龄（岁）',page);self.assertIn('收入（元）',page)
    def test_three_portable_outputs_and_no_overwrite(self):
        with tempfile.TemporaryDirectory() as temp:
            out=Path(temp)/'result';files=write_outputs(self.payload(),out,ASSETS)
            self.assertEqual(set(files),{'html','request','data'})
            self.assertTrue(all(path.is_file() for path in files.values()))
            request=json.loads(files['request'].read_text())
            self.assertEqual(build_payload(request,out)['charts'],self.payload()['charts'])
            with self.assertRaises(FileExistsError):write_outputs(self.payload(),out,ASSETS)
    def test_missing_asset_leaves_no_partial_output(self):
        with tempfile.TemporaryDirectory() as temp:
            out=Path(temp)/'result'
            with self.assertRaises(FileNotFoundError):write_outputs(self.payload(),out,Path(temp))
            self.assertFalse(out.exists())
    def test_table_request_replays_typed_records_and_ids(self):
        payload=build_payload({'version':1,'title':'分布','dataset':{
          'source':{'records':[{'id':'001','x':0},{'id':'002','x':None},{'id':'003','x':3}]},'idColumn':'id',
          'columns':[{'name':'id','type':'string'},{'name':'x','type':'number'}]},
          'charts':[{'id':'p','binding':{'type':'histogram','fields':{'value':'x'}}}]},Path('.'))
        with tempfile.TemporaryDirectory() as temp:
            files=write_outputs(payload,Path(temp)/'out',ASSETS)
            replay=build_payload(json.loads(files['request'].read_text()),Path(temp))
            self.assertEqual(replay['dataset']['rows'],payload['dataset']['rows'])
    def test_optional_capabilities_and_conditions_replay(self):
        payload=self.payload()
        payload['presentation']={'actions':['exportSpec'],'details':['provenance']}
        payload['charts'][0]['interactions']=['legendFilter']
        with tempfile.TemporaryDirectory() as temp:
            files=write_outputs(payload,Path(temp)/'out',ASSETS)
            replay=build_payload(json.loads(files['request'].read_text()),Path(temp))
            self.assertEqual(replay,payload)
if __name__=='__main__':unittest.main()
