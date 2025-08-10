import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';

export default function VerticalDemo() {
  return (
    <div className='demo-wrap'>
      <PanelGroup direction="vertical">
        <Panel minSize={10} defaultSize={30}>
          top
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} defaultSize={30}>
          middle
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} defaultSize={40}>
          bottom
        </Panel>
      </PanelGroup>
    </div>

  )
};
