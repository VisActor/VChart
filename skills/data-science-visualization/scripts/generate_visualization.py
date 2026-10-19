#!/usr/bin/env python3
"""Generate a portable visualization directory; never fit models or upload data."""
import argparse
import json
from pathlib import Path
import sys
from visualization_io import load_request, build_payload
from visualization_html import write_outputs

def main():
    parser=argparse.ArgumentParser(description='生成 statplots 交互 HTML（Python 3.11+）')
    parser.add_argument('--request',required=True,type=Path)
    parser.add_argument('--output',required=True,type=Path)
    args=parser.parse_args()
    if sys.version_info < (3,11):
        print('需要 Python 3.11+；请指定可用 Python，或使用 uv run --python 3.12。',file=sys.stderr)
        return 2
    try:
        payload=build_payload(load_request(args.request),args.request.resolve().parent)
        files=write_outputs(payload,args.output,Path(__file__).resolve().parents[1]/'assets')
        print(json.dumps({key:str(value) for key,value in files.items()},ensure_ascii=False))
        return 0
    except (ValueError,TypeError,KeyError) as error:
        print(f'输入错误：{error}',file=sys.stderr)
        return 2
    except OSError as error:
        print(f'文件或资源错误：{error}',file=sys.stderr)
        return 3
if __name__=='__main__':sys.exit(main())
