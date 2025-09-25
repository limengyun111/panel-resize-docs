import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';
import { useState } from 'react';
import Editor from '@monaco-editor/react';

const LeftPanel = () => {
  return (
    <div className='left-panel'>
      <div className='menu-icon'>
        <svg t="1755305880650" className="file-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17975" width="16" height="16"><path d="M859.49512 766.81527H703.703818V611.023968a35.976416 35.976416 0 1 0-71.888932 0V766.81527H484.011243a35.976416 35.976416 0 0 0 0 71.888932h147.803643v147.803643a35.976416 35.976416 0 1 0 71.888932 0v-147.803643h155.791302a35.976416 35.976416 0 1 0 0-71.888932z m15.016799-465.456869L596.988692 21.279124a77.32054 77.32054 0 0 0-14.825095-11.502229 60.897913 60.897913 0 0 0-4.345286-2.300446C576.923693 7.02914 575.901273 6.581831 575.006655 6.198423A72.272339 72.272339 0 0 0 545.867674 0H200.481296A71.82503 71.82503 0 0 0 128.592365 71.888932v878.642497A71.82503 71.82503 0 0 0 200.481296 1022.420361h211.704916a35.976416 35.976416 0 1 0 0-71.888932H200.417395V71.888932H512v239.629772A71.82503 71.82503 0 0 0 583.888932 383.407635h239.629772v155.791303a35.976416 35.976416 0 1 0 71.888931 0v-187.230729a71.82503 71.82503 0 0 0-20.895716-50.609808z m-290.622987 10.160303v-201.289009l199.499772 201.289009z" p-id="17976" fill="#171A1C"></path></svg>
        <svg t="1755305933785" className="folder-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18565" width="20" height="20"><path d="M554.666667 512V384h-85.333334v128H341.333333v85.333333h128v128h85.333334v-128h128v-85.333333h-128z m-111.701334-341.333333c16.170667 0 30.933333 9.130667 38.144 23.594666L512 256h341.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v512a42.666667 42.666667 0 0 1-42.666667 42.666666H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666666V213.333333a42.666667 42.666667 0 0 1 42.666667-42.666666h272.298666z" p-id="18566"></path></svg>      </div>
      <div className='menu-hr'></div>
      <div>
        <div className='menu-list-hover'>
          <span className='list-lang'>js</span>
          index.js
        </div>
        <div className='menu-list'>
          <span className='list-lang'>{'{}'}</span>
          package.json
        </div>
      </div>

    </div>
  )
}
const EditorPanel = ({ getEditorInstance }) => {
 
  // // 初始化 Editor 并保存实例
  const handleEditorMount = (editor) => {
    getEditorInstance && getEditorInstance(editor);
  };


  const value = `/** 
 * @param params 调用参数，HTTP 请求下为请求体
 * @param context 调用上下文
 *
 * @return 函数的返回数据，HTTP 场景下会作为 Response Body
 *
 */

let { dySDK } = require("@open-dy/node-server-sdk");
module.exports = async function (params, context) {
  // 云函数 params、context 使用介绍：云函数Api_开发者平台_抖音开放平台
  const serviceContext = dySDK.context(context);

  // @open-dy/node-server-sdk 提供 3 个能力：获取用户信息、免鉴权云调用OpenApi、服务间调用，详情见 云函数开发指南_抖音开放平台
  const contextInfo = serviceContext.getContext();
  context.log(params,contextInfo);

  return {
    source: contextInfo.source, // 调用来源
    ip: contextInfo.ip, // 调用来源的IP地址
    appId: contextInfo.appId,
    envId: contextInfo.envId,
    openId: contextInfo.openId, // 用户的openId，在调试环境下为空，
    unionId: contextInfo.unionId, // 用户的unionId，在调试环境下为空，
    anonymousOpenid: contextInfo.anonymousOpenid // 用户的匿名openId，在调试环境下为空。 
  }
};`;
  return (
    <div className='editor-panel'>
      <div>
        <span className='list-lang'>js</span>
        index.js
      </div>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={value}
        theme="vs-dark"
        onMount={handleEditorMount}

      />

    </div>

  )

}
const LogPanel = () => {
  return (
    <div className='log-panel'>
      日志调试
      <div className='log-info'>
        开始调试...
        <div>16:24:38:167</div>
        <span>openId: contextInfo.openId</span>
        <div>16:25:38:167</div>
        <span>params.contextInfo</span>
        <div>调试结束</div>
      </div>
    </div>

  )

}
const ActionPanel = () => {
  return (
    <div className='action-panel'>
      <button className='online-debug'>调试</button>
      <button>设置</button>
      <button>发布</button>
    </div>
  )

}
export default function CloudDemo() {
  const [, setEditorInstance] = useState(null);

  const getEditorInstance = (editor) => {
    setEditorInstance(editor)
  }

  return (
    <div className='cloud-demo-wrap'>
      <PanelGroup direction="horizontal" className="cloud-group">
        <Panel className="cloud-panel-left" minSize={15}>
          <LeftPanel />
        </Panel>
        <PanelResizeHandle className="handler-bar" />
        <Panel className="cloud-panel-middle" defaultSize={80} minSize={70}>

          <PanelGroup direction="vertical" className="cloud-group-vertical">
          <Panel className="cloud-panel-top" defaultSize={80} minSize={60}>
              <PanelGroup className="cloud-group">
                <Panel className="cloud-panel-left-editor" defaultSize={65}>
                  <EditorPanel getEditorInstance={getEditorInstance}  />
                </Panel>
                <PanelResizeHandle className="handler-bar" />
                <Panel className="cloud-panel-right-action" minSize={25}>
                  <ActionPanel />
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="handler-bar" />
            <Panel className="cloud-panel-bottom" minSize={15}>
              <LogPanel />
            </Panel>
          </PanelGroup>


        </Panel>
      </PanelGroup>
    </div>
  )
}