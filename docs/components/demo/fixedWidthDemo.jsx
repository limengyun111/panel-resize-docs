import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';

export default function FixedWidthDemo() {
  return (
    <div className='demo-wrap'>
      <PanelGroup>
        <Panel minSize={10} defaultSize={'100px'}>
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
