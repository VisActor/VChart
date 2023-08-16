import { Layout, Menu } from '@arco-design/web-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from './header';
import { useContext, useEffect, useRef, useState } from 'react';
import { LanguageContext } from './i18n';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

let globalContainerId = 0;

interface IMenuItem {
  path: string;
  fullPath: string;
  title: { [language: string]: string };
  children?: IMenuItem[];
}

interface IOutlineProps {
  menuItems: IMenuItem[];
  assetDirectory: string;
}

interface IOutlineNodeProps {
  menuItem: IMenuItem;
  assetDirectory: string;
}

interface IContentProps {
  content: string;
}

function htmlRestore(str: string) {
  var s = '';
  if (str.length === 0) {
    return '';
  }
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&quot;/g, '"');
  return s;
}

function OutlineNode(props: IOutlineNodeProps) {
  const { language, setLanguage } = useContext(LanguageContext);

  const node = props.menuItem;
  const navigate = useNavigate();

  return node.children ? (
    <SubMenu key={node.fullPath} title={<>{node.title[language]}</>}>
      <div style={{ marginLeft: 10 }}>
        {node.children.map((subNode: any) => (
          <OutlineNode key={subNode.fullPath} menuItem={subNode} assetDirectory={props.assetDirectory} />
        ))}
      </div>
    </SubMenu>
  ) : (
    <MenuItem
      key={node.fullPath}
      onClick={() => {
        document.getElementById('markdownDocumentContainer')?.scrollTo?.({
          top: 0
          // behavior: 'smooth',
        });
        navigate(`/${props.assetDirectory}${node.fullPath}`, { replace: true });
      }}
    >
      {node.title[language]}
    </MenuItem>
  );
}

function Outline(props: IOutlineProps) {
  const location = useLocation();
  const { pathname: pathName } = location;
  const fullPath = pathName.split(`/`)[0];

  return (
    <div
      className="menu-demo-round"
      style={{
        paddingTop: 20,
        paddingBottom: 20
      }}
    >
      <Menu selectedKeys={[fullPath]}>
        {(props.menuItems ?? []).map((node: any) => (
          <OutlineNode key={node.path} menuItem={node} assetDirectory={props.assetDirectory} />
        ))}
      </Menu>
    </div>
  );
}

function Content(props: IContentProps) {
  const demos = [...props.content.matchAll(/<pre><code class="language-javascript">((.|\n)*?)<\/code><\/pre>/g)];

  let content = props.content;

  const runnings = demos.map(demo => {
    const pre = demo[0];
    const code = demo[1];
    const containerId = `markdown-demo-${globalContainerId++}`;
    content = content.replace(pre, `<div id="${containerId}" class="markdown-demo"></div>`);
    const evaluateCode = code.replace('CONTAINER_ID', `"${containerId}"`).concat(`window['${containerId}'] = vchart;`);
    return {
      code: htmlRestore(evaluateCode),
      id: containerId
    };
  });

  useEffect(() => {
    runnings.forEach(async running => {
      try {
        console.log(running.code);
        // Function(running.code)(window);
        await Object.getPrototypeOf(async function () {}).constructor(running.code)();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
    return () => {
      runnings.forEach(running => {
        (window as any)[running.id]?.release?.();
      });
    };
  }, [runnings]);

  return (
    <div
      className="markdown-container"
      style={{ padding: '20px 40px' }}
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
}

export function Markdown() {
  const { language, setLanguage } = useContext(LanguageContext);

  const location = useLocation();
  const { pathname: pathName } = location;
  const assetDirectory = pathName.split('/')[1];

  const [outline, setOutline] = useState<any>([]);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const menuPath = `../assets/${assetDirectory}/menu.json`;
    import(menuPath).then(menu => {
      const menuItems = menu.children as IMenuItem[];
      // parse menu full path
      function traverse(menuItem: IMenuItem, path: string) {
        menuItem.fullPath = `${path}/${menuItem.path}`;
        (menuItem.children ?? []).forEach(subItem => {
          traverse(subItem, menuItem.fullPath);
        });
      }
      menuItems.forEach(menuItem => traverse(menuItem, ''));
      setOutline(menu.children);
    });
  }, [language, assetDirectory]);

  useEffect(() => {
    const docFullPath = pathName.split(`/${assetDirectory}/`)[1];
    if (!docFullPath) {
      setContent('');
    } else {
      const docPath = `../assets/${assetDirectory}/${language}/${docFullPath}.md`;
      import(docPath).then(doc => {
        setContent(doc?.html);
      });
    }
  }, [language, pathName, assetDirectory]);

  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout style={{ marginTop: 48 }}>
        <Layout.Sider style={{ height: 'calc(100vh - 48px)', width: 280 }}>
          <Outline menuItems={outline} assetDirectory={assetDirectory} />
        </Layout.Sider>
        <Layout.Content style={{ height: 'calc(100vh - 48px)' }}>
          <Content content={content} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
