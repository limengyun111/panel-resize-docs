import { useEffect } from 'react';
import PanelResize from './panel-resize';

function App() {

  useEffect(() => {
    new PanelResize(document.getElementById('wrapper-resize'),
      [{ minSize: 10, defaultSize: 30 }, { minSize: 20, defaultSize: 30 }, { minSize: 20, defaultSize: 40 }]);
  }, []);

  return (
    <div className="wrapper" id="wrapper-resize">
      <div className="panel-one">panel-one</div>
      <div className="handle-one"></div>
      <div className="panel-two">panel-two</div>
      <div className="handle-two"></div>
      <div className="panel-three">panel-three</div>
    </div>

  );
}

export default App;
