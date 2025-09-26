import { PanelGroup, Panel, PanelResizeHandle } from 'panel-resize-v1';

import * as echarts from 'echarts';
import { useEffect } from 'react';





export default function TwoPanelDemo() {

  useEffect(() => {
    const lineChartDom = document.getElementById('lineChart');
    const pieChartDom = document.getElementById('pieChart');

    const lineChart = echarts.init(lineChartDom);
    const pieChart = echarts.init(pieChartDom);

    let lineChartOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    let pieChartOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '60%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [

            { value: 580, name: 'Email' },
            { value: 484, name: 'Union' },
            { value: 300, name: 'Video' }
          ]
        }
      ]
    };


    lineChart.setOption(lineChartOption);
    pieChart.setOption(pieChartOption);

    const resizeObserver = new ResizeObserver(entries => {
      lineChart.resize();
      pieChart.resize();
    });
    resizeObserver.observe(lineChartDom);

  }, []);

  return (
    <div className='demo-wrap'>
      <PanelGroup>
        <Panel minSize={30}>
          <div id="lineChart" style={{ height: '100%' }}>
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={30}>
          <div id="pieChart" style={{ height: '100%' }}>
          </div>
        </Panel>
      </PanelGroup>
    </div>

  )
};