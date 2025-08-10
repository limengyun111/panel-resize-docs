import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';


export default function CustomCursorDemo() {

  const customCursor = ({ isPointerDown }) => {
    return isPointerDown ? 'grabbing': 'grab'
  }
  return (
    <div className='demo-wrap'>
      <PanelGroup customCursor={customCursor}>
        <Panel minSize={10} defaultSize={30}>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} defaultSize={30}>
          right
        </Panel>
      </PanelGroup>
    </div>

  )
};