import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';

export default function HorizontalDemo() {
  return (
    <div className='demo-wrap'>
      <PanelGroup>
        <Panel minSize={10} defaultSize={30}>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} defaultSize={30}>
          middle
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} defaultSize={40}>
          right
        </Panel>
      </PanelGroup>
    </div>

  )
};
