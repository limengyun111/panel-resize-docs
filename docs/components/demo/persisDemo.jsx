import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';

export default function PersisDemo() {
  return (
    <div className='demo-wrap'>
      <PanelGroup autoSaveId="persistence">
        <Panel>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel>
          middle
        </Panel>
        <PanelResizeHandle />
        <Panel>
          right
        </Panel>
      </PanelGroup>
    </div>
  )
}

