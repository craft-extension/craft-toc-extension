import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Row, Col, ConfigProvider, Tree, Button, notification} from 'antd';
import './style.css';

const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();

  function useCraftDarkMode() {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
  
    React.useEffect(() => {
      craft.env.setListener(env => setIsDarkMode(env.colorScheme === 'dark'));
    }, []);
  
    return isDarkMode;
  }

  React.useEffect(() => {
    if (isDarkMode) {
      // Note: 根据应用主题模式，适配 UI，各种颜色配置详见：https://ant-design.gitee.io/docs/react/customize-theme-variable-cn
      ConfigProvider.config({
        theme: {
            primaryColor: '#f04848',
        }
      });
    } else {
      ConfigProvider.config({
        theme: {
            primaryColor: 'blue',
        }
      });
    }
  }, [isDarkMode]);

  const [toc, setToc] = React.useState([]);
  const HEADING_TYPE_MAP = {
    'title': 1,
    'subtitle': 2,
    'heading': 3,
    'strong': 4
  };

  const generateTOC = React.useCallback(async () => {
    const result = await craft.dataApi.getCurrentPage();
    if (result.status !== 'success') {
      notification.open({
        message: '获取页面内容错误',
      });
    } else {
      const pageBlock = result.data;
      console.log('pageBlock:', pageBlock);
      const toc = [] as any;
      pageBlock.subblocks.forEach((block, k) => {
        if (block.type === 'textBlock') {
          const {style: {textStyle}, id} = block;
          console.log('textStyle:', textStyle);
          // Note: 共有四级
          switch(textStyle) {
            case 'title':
              toc.push({
                title: `${block.content[0]?.text}`,
                id,
                key: `${k}-0`,
                tag: 'h1',
                blank: 0,
              });
              break;
            case 'subtitle':
              toc.push({
                title: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${block.content[0]?.text}`,
                id,
                key: `${k}-0`,
                tag: 'h2',
                blank: 2,
              });
              break;
            case 'heading':
              toc.push({
                title: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${block.content[0]?.text}`,
                id,
                key: `${k}-0`,
                tag: 'h3',
                blank: 4,
              });
              break;
            case 'strong':
              toc.push({
                title: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${block.content[0]?.text}`,
                id,
                key: `${k}-0`,
                tag: 'h4',
                blank: 6,
              });
              break;
          }
        }
      });
      console.log('toc:', toc);
      setToc(toc);
    }
  }, []);

  return (
    <Row style={{padding: '30px 0'}}>
      <Col span={24}>
      <Button type="primary" onClick={generateTOC} style={{marginBottom: '30px'}}>生成 TOC</Button>
      <Tree
        rootStyle={{padding: '0', margin: '10px 0'}}
        selectable={false}
        blockNode={true}
        titleRender={({title, id, key, tag, blank}) => {
          const Tag: any = tag;
          return (<Tag style={{cursor: 'pointer'}} key={key} onClick={() => {
            // Note: 点击会打开新的页面而不是定位到当前位置，算了
            // @ts-ignore
          }} dangerouslySetInnerHTML={{__html: title}}></Tag>)
        }}
        defaultExpandAll
        treeData={toc}
      />
      </Col>
    </Row>
  );
}

// API 示例
// async function insertHelloWorld () {
//   // console.log('shit');
//   const block = craft.blockFactory.textBlock({
//     content: 'Hello world!'
//   });
//   const data = await craft.dataApi.getCurrentPage();
//   console.log('data:', data);
//   if (data && data.data) {
//     // Note: 这里我们判断了 data
//     const md = craft.markdown.craftBlockToMarkdown([data.data], 'common', {
//       tableSupported: true,
//     })
//     console.log('md:', md);
//   }
//   craft.dataApi.addBlocks([block]);
// }

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'))
}
