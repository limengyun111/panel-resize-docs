import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';
import { useRef } from 'react';
export default function ImperativePanelGroupAPIDemo() {
  const ref = useRef(null);

  const handleReset = () => {
    ref?.current?.setLayout([{ minSize: 10, defaultSize: 25 }, { minSize: 30, defaultSize: 75 }]);
  }

  return (
    <>
      <div onClick={handleReset} className='reset-layout-btn'>Reset Layout</div>
      <div className='demo-wrap'>
        <PanelGroup panelRef={ref}>
          <Panel>
            left
          </Panel>
          <PanelResizeHandle />
          <Panel>
            right
          </Panel>
        </PanelGroup>
      </div>
    </>

  )
};
