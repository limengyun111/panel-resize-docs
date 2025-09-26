import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';


export default function MultiPanelDemo() {

  return (
    <div className='demo-wrap'>
      <PanelGroup>
        <Panel>
          config.ts
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>file.tsx</div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>file.tsx</div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>file.tsx</div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>file.tsx</div>
        </Panel>
         <PanelResizeHandle />
        <Panel>
          <div>file.tsx</div>
        </Panel>
      </PanelGroup>
    </div>

  )
};