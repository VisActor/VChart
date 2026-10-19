"""Exercise generated HTML wiring; real VChart rendering is a separate check."""
from __future__ import annotations

import json
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[4] / "skills/vchart-development-assistant/scripts/generate_demo_html.py"


def generate(tmp_path: Path, source: str) -> tuple[subprocess.CompletedProcess[str], Path]:
    spec = tmp_path / "spec.js"
    spec.write_text(source)
    output = tmp_path / "output/demo.html"
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--spec-file", str(spec), "--output", str(output)],
        capture_output=True, text=True, cwd=tmp_path,
    )
    return result, output


def generated_script(output: Path) -> Path:
    """Extract inline script with HTML parsing, so premature closing tags fail."""
    class Scripts(HTMLParser):
        def __init__(self):
            super().__init__()
            self.active = False
            self.scripts = []

        def handle_starttag(self, tag, attrs):
            if tag == "script":
                self.active = True
                self.scripts.append("")

        def handle_data(self, data):
            if self.active:
                self.scripts[-1] += data

        def handle_endtag(self, tag):
            if tag == "script":
                self.active = False

    parser = Scripts()
    parser.feed(output.read_text())
    script = next(text for text in parser.scripts if "DOMContentLoaded" in text)
    target = output.with_suffix(".js")
    target.write_text(script)
    return target


@pytest.mark.parametrize("source,code", [
    ("const spec={type:'bar',legends:{data:[]}}", "DISCRETE_LEGEND_DATA_FUNCTION"),
    ("const spec={type:'bar',label:{formatMethod:'__CALLBACK__'}}", "LABEL_FORMAT_METHOD_FUNCTION"),
    ("const spec={type:'treemap',data:{value:[]}}", "DATA_VALUES_REQUIRED"),
    ("const spec={type:'treemap',data:{values:{children:[]}}}", "HIERARCHY_ROOT_ARRAY"),
    ("const spec={type:'sankey',data:{values:[{source:'a',target:'b',value:2}]}}", "SANKEY_GRAPH_REQUIRED"),
    ("const spec={type:'sankey',data:{values:{nodes:[],links:[]}}}", "SANKEY_GRAPH_REQUIRED"),
    ("const spec={type:'treemap',data:{values:[]},label:{formatter:()=>''}}", "FUNCTION_FORMATTER"),
    ("const spec={type:'bar',data:{values:[]},customMark:[{type:'text',style:{x:'50%',y:120,text:'No data'}}]}", "CUSTOM_MARK_PIXEL_COORDINATE"),
])
def test_invalid_spec_does_not_publish_html(tmp_path: Path, source: str, code: str) -> None:
    result, output = generate(tmp_path, source)
    assert result.returncode != 0
    assert code in result.stderr
    assert not output.exists()


@pytest.mark.parametrize("kind", ["treemap", "sankey", "bar"])
def test_empty_data_can_be_delivered(tmp_path: Path, kind: str) -> None:
    result, output = generate(tmp_path, f"const spec={{type:'{kind}',data:{{values:[]}}}}")
    assert result.returncode == 0, result.stderr
    assert output.is_file()


@pytest.mark.parametrize("name", ["A", "</script>", "</ScRiPt >", "<!-- <script> -->", "引号\"、反斜杠\\、`和${value}\n下一行"])
def test_editor_preserves_source_and_helper_closures_and_validates_edits(tmp_path: Path, name: str) -> None:
    source = """window.sourceRuns = (window.sourceRuns || 0) + 1;
const rows = [{name:'A',amount:23}];
function label(d) { return `${d.name}: ${d.amount}`; }
const spec = {type:'bar',data:{values:rows},label:{formatMethod:(_text,d)=>label(d)}};
"""
    source = source.replace("name:'A'", "name:" + json.dumps(name, ensure_ascii=False))
    result, output = generate(tmp_path, source)
    assert result.returncode == 0, result.stderr
    probe = r"""
const fs=require('node:fs'),vm=require('node:vm');
const script=fs.readFileSync(process.argv[1],'utf8');
let rendered,editorValue,editorChange,renderCount=0;
const container={innerHTML:''};
const ctx={document:{addEventListener:(_e,f)=>f(),getElementById:()=>container},
  require:(_deps,f)=>f(),monaco:{editor:{create:(_el,options)=>{
    editorValue=options.value;return {onDidChangeModelContent:f=>editorChange=f,getValue:()=>editorValue};
  }}},VChart:{default:class {constructor(spec){rendered=spec;}renderSync(){renderCount++;}release(){}}},
  setTimeout:f=>f(),clearTimeout:()=>{}};
ctx.window=ctx;vm.runInNewContext(script,ctx);
const initial={editorValue,label:rendered.label.formatMethod('',rendered.data.values[0]),renderCount,sourceRuns:ctx.sourceRuns};
editorChange();
const afterEdit={sourceRuns:ctx.sourceRuns,renderCount};
editorValue="const spec={type:'sankey',data:{values:[{source:'a',target:'b',value:2}]}}";
editorChange();
const error=container.innerHTML;
const invalidObjectErrors=[];
for (const value of ['undefined','null','[]',"'bar'"]) {
  editorValue='const spec='+value+';';editorChange();
  invalidObjectErrors.push(container.innerHTML);
}
console.log(JSON.stringify({initial,afterEdit,renderCount,error,invalidObjectErrors}));
"""
    checked = subprocess.run(["node", "-e", probe, str(generated_script(output))], capture_output=True, text=True, check=True)
    report = json.loads(checked.stdout)
    assert report["initial"]["editorValue"] == source.strip()
    assert report["initial"]["label"] == f"{name}: 23"
    assert report["initial"]["sourceRuns"] == report["initial"]["renderCount"] == 1
    assert report["afterEdit"] == {"sourceRuns": 2, "renderCount": 2}
    assert report["renderCount"] == 2
    assert "SANKEY_GRAPH_REQUIRED" in report["error"]
    assert all("SPEC_OBJECT_REQUIRED" in error for error in report["invalidObjectErrors"])


def test_browser_initialization_error_can_be_fixed_in_editor(tmp_path: Path) -> None:
    result, output = generate(tmp_path, "if (!window.ready) throw Error('Waiting for input'); const spec={type:'bar',data:{values:[]}};")
    assert result.returncode == 0, result.stderr
    probe = r"""
const fs=require('node:fs'),vm=require('node:vm');
const script=fs.readFileSync(process.argv[1],'utf8');
let editorValue,editorChange,renders=0;
const container={innerHTML:''};
const ctx={document:{addEventListener:(_e,f)=>f(),getElementById:()=>container},
  require:(_deps,f)=>f(),monaco:{editor:{create:(_el,options)=>{
    editorValue=options.value;return {onDidChangeModelContent:f=>editorChange=f,getValue:()=>editorValue};
  }}},VChart:{default:class {renderSync(){renders++;}release(){}}},setTimeout:f=>f(),clearTimeout:()=>{}};
ctx.window=ctx;vm.runInNewContext(script,ctx);
const initialError=container.innerHTML;
editorValue="const spec={type:'bar',data:{values:[]}}";editorChange();
console.log(JSON.stringify({initialError,renders,error:container.innerHTML}));
"""
    checked = subprocess.run(["node", "-e", probe, str(generated_script(output))], capture_output=True, text=True, check=True)
    report = json.loads(checked.stdout)
    assert "Waiting for input" in report["initialError"]
    assert report["renders"] == 1
    assert report["error"] == ""
