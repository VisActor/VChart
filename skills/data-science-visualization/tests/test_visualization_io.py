import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from visualization_io import build_payload

class InputTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / 'records.csv').write_text('\ufeffid,income,group\n001,0,A\n002,,A\n003,3,B\n004,3,B\n', encoding='utf-8')
        self.request = {'version':1,'title':'收入','dataset':{
            'source':{'path':'records.csv','format':'csv'},'idColumn':'id',
            'columns':[{'name':'id','type':'string'},{'name':'income','type':'number'},{'name':'group','type':'string'}]},
            'charts':[{'id':'distribution','binding':{'type':'histogram','fields':{'value':'income'}}}]}
    def tearDown(self):
        self.temp.cleanup()
    def test_csv_preserves_zero_ids_and_observation_multiplicity(self):
        data = build_payload(self.request,self.root)['dataset']
        self.assertEqual(data['rows'][0]['id'],'001')
        self.assertEqual(data['rows'][0]['values']['income'],0)
        self.assertIsNone(data['rows'][1]['values']['income'])
        self.assertEqual(len(data['rows']),4)
        self.assertEqual(data['source']['originalN'],4)
        self.assertEqual(len(data['source']['sha256']),64)
        self.assertNotIn('group',data['rows'][0]['values'])
    def test_json_null_false_empty_string_are_distinct(self):
        request={'version':1,'title':'缺失','dataset':{'source':{'records':[{'v':False,'s':''},{'v':None,'s':'x'}]},
          'columns':[{'name':'v','type':'boolean'},{'name':'s','type':'string'}]},
          'charts':[{'id':'quality','binding':{'type':'missingValueMatrix','fields':{'variables':['v','s']}}}]}
        data=build_payload(request,self.root)['dataset']
        self.assertIs(data['rows'][0]['values']['v'],False)
        self.assertEqual(data['rows'][0]['values']['s'],'')
        self.assertIsNone(data['rows'][1]['values']['v'])
    def test_invalid_number_and_duplicate_id_fail(self):
        for text in ['id,income\n001,oops\n','id,income\n001,Infinity\n','id,income\n001,2\n001,3\n']:
            (self.root/'records.csv').write_text(text)
            with self.assertRaises(ValueError): build_payload(self.request,self.root)
    def test_strict_request_and_controls(self):
        for change in [lambda r:r.update(extra=True),lambda r:r['dataset']['source'].update(records=[]),
                       lambda r:r['charts'][0].update(spec={'type':'histogram','data':[]}),
                       lambda r:r.update(controls={'filters':[{'field':'unknown','kind':'category'}]})]:
            request=copy.deepcopy(self.request);change(request)
            with self.assertRaises(ValueError): build_payload(request,self.root)
    def test_number_strings_and_nonstandard_json_rejected(self):
        request=copy.deepcopy(self.request)
        request['dataset']['source']={'records':[{'id':'001','income':'2'}]}
        with self.assertRaises(ValueError): build_payload(request,self.root)
        request['dataset']['source']={'path':'records.json','format':'json'}
        (self.root/'records.json').write_text('[{"id":"001","income":NaN}]')
        with self.assertRaises(ValueError): build_payload(request,self.root)
    def test_matrix_and_page_budgets_apply_to_direct_specs(self):
        request={'version':1,'title':'大矩阵','charts':[{'id':'p','source':{'label':'结果'},'spec':{
            'type':'pairPlot','variables':['a','b','c','d','e'],'data':{'observations':[]}}}]}
        with self.assertRaisesRegex(ValueError,'4'): build_payload(request,self.root)
    def test_xlsx_missing_dependency_explains_conversion(self):
        from unittest.mock import patch
        request=copy.deepcopy(self.request);request['dataset']['source']={'path':'records.xlsx','format':'xlsx','sheet':'Sheet1'}
        (self.root/'records.xlsx').write_bytes(b'xlsx')
        with patch.dict(sys.modules,{'openpyxl':None}):
            with self.assertRaisesRegex(ValueError,'openpyxl|CSV'):build_payload(request,self.root)
    def test_variable_candidates_are_preserved(self):
        request=copy.deepcopy(self.request)
        request['controls']={'variableSwitch':[{'chartId':'distribution','role':'value','candidates':['income']}],
                             'filters':[{'field':'group','kind':'category'}]}
        data=build_payload(request,self.root)['dataset']
        self.assertEqual(data['rows'][0]['values']['group'],'A')

    def test_xlsx_with_optional_dependency_preserves_typed_values(self):
        try:
            import openpyxl
        except ImportError:
            self.skipTest('可选 openpyxl 不在本测试解释器中')
        book=openpyxl.Workbook();sheet=book.active;sheet.title='Data'
        sheet.append(['id','income']);sheet.append(['001',0]);sheet.append(['002',None])
        book.save(self.root/'records.xlsx');book.close()
        request=copy.deepcopy(self.request);request['dataset']['source']={'path':'records.xlsx','format':'xlsx','sheet':'Data'}
        payload=build_payload(request,self.root)
        self.assertEqual(payload['dataset']['rows'][0]['values']['income'],0)
        self.assertIsNone(payload['dataset']['rows'][1]['values']['income'])
        self.assertEqual(payload['dataset']['rows'][0]['id'],'001')
        self.assertIn('Data',payload['dataset']['source']['label'])

    def test_initial_filters_require_valid_conditions(self):
        request=copy.deepcopy(self.request)
        request['controls']={'filters':[{'field':'group','kind':'category'}],
          'initialFilters':[{'field':'group','kind':'category','value':'A'}]}
        payload=build_payload(request,self.root)
        self.assertEqual(len(payload['dataset']['rows']),4)
        self.assertEqual(payload['controls']['initialFilters'][0]['value'],'A')
        for value in ['unknown',True]:
            invalid=copy.deepcopy(request);invalid['controls']['initialFilters'][0]['value']=value
            with self.assertRaises(ValueError):build_payload(invalid,self.root)
        invalid=copy.deepcopy(request);invalid['controls']['filters']=[]
        self.assertEqual(len(build_payload(invalid,self.root)['dataset']['rows']),4)

    def test_default_presentation_and_independent_fixed_filters(self):
        request=copy.deepcopy(self.request)
        request['controls']={'initialFilters':[{'field':'group','kind':'category','value':'A'}]}
        payload=build_payload(request,self.root)
        self.assertEqual(payload['presentation'],{'actions':[],'details':[]})
        self.assertNotIn('filters',payload['controls'])
        self.assertEqual(payload['dataset']['rows'][0]['values']['group'],'A')
        self.assertEqual(len(payload['dataset']['rows']),4)
        for change in [lambda r:r['controls']['initialFilters'][0].update(field='unknown'),
                       lambda r:r['controls']['initialFilters'][0].update(kind='unknown'),
                       lambda r:r['controls']['initialFilters'][0].update(field='income'),
                       lambda r:r['controls']['initialFilters'].append(r['controls']['initialFilters'][0])]:
            invalid=copy.deepcopy(request);change(invalid)
            with self.assertRaises(ValueError):build_payload(invalid,self.root)

    def test_optional_presentation_and_interactions_are_strict(self):
        request=copy.deepcopy(self.request)
        request['presentation']={'actions':['exportPNG','saveView'],'details':['counts']}
        request['charts'][0]['interactions']=['legendFilter']
        payload=build_payload(request,self.root)
        self.assertEqual(payload['presentation'],request['presentation'])
        self.assertEqual(payload['charts'][0]['interactions'],['legendFilter'])
        for value in [{'actions':['unknown']},{'actions':['theme','theme']},{'details':['counts','counts']},
                      {'actions':'theme'},{'unknown':[]},{'details':[False]}]:
            invalid=copy.deepcopy(request);invalid['presentation']=value
            with self.assertRaises(ValueError):build_payload(invalid,self.root)
        for value in [['brush'],['unknown'],['legendFilter','legendFilter'],'brush']:
            invalid=copy.deepcopy(request);invalid['charts'][0]['interactions']=value
            with self.assertRaises(ValueError):build_payload(invalid,self.root)
        request['charts'][0]['binding']={'type':'pairPlot','fields':{'variables':['income']}}
        request['charts'][0]['interactions']=['brush']
        build_payload(request,self.root)
        request['charts'][0]['interactions']=['legendFilter']
        with self.assertRaises(ValueError):build_payload(request,self.root)

    def test_initial_unbounded_range_and_reversed_range(self):
        request=copy.deepcopy(self.request)
        request['controls']={'filters':[{'field':'income','kind':'range'}],
          'initialFilters':[{'field':'income','kind':'range','value':[None,3]}]}
        self.assertEqual(build_payload(request,self.root)['controls']['initialFilters'][0]['value'],[None,3])
        for value in [[4,3],[None,None],[True,3]]:
            invalid=copy.deepcopy(request);invalid['controls']['initialFilters'][0]['value']=value
            with self.assertRaises(ValueError):build_payload(invalid,self.root)

    def test_quoted_csv_and_tsv_keep_category_text(self):
        request=copy.deepcopy(self.request)
        request['charts']=[{'id':'counts','binding':{'type':'countPlot','fields':{'category':'group'}}}]
        for name,kind,content in [('quoted.csv','csv','id,group\n001,"A,区\n跨行"\n'),
                                  ('records.tsv','tsv','id\tgroup\n001\t东区\n')]:
            (self.root/name).write_text(content)
            request['dataset']['source']={'path':name,'format':kind}
            value=build_payload(request,self.root)['dataset']['rows'][0]['values']['group']
            self.assertEqual(value,'A,区\n跨行' if kind=='csv' else '东区')

if __name__=='__main__':unittest.main()
