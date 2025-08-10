import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';

export default function NestedDemo() {
  return (
    <div className='demo-wrap'>
      <PanelGroup direction="horizontal">
        <Panel>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              top
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <PanelGroup direction="horizontal">
                <Panel>
                  left
                </Panel>
                <PanelResizeHandle />
                <Panel>
                  right
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          right
        </Panel>
      </PanelGroup>
    </div>
  )
}