from pathlib import Path
import sys
import json
import tempfile
import unittest
from html.parser import HTMLParser
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from visualization_io import build_payload
from visualization_html import render_html, write_outputs
ASSETS=Path(__file__).resolve().parents[1]/'assets'

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
        self.assertIn('&lt;b&gt;真实结果&lt;/b&gt;',page)
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
if __name__=='__main__':unittest.main()
