import React, { useState, useEffect } from "react";
import Graph from "react-vis-network-graph";

function App() {
  const [graphDataSet, setGraphDataSet] = useState({});
  const [graphNetwork, setGraphNetwork] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    let graphDataSet = {};
    graphDataSet.nodes = graph.nodes.map((node) => {
      if (node.id === "c1") {
        return {
          ...node,
          borderWidth: 2,
          color: {
            background: "#ee6666",
            border: "#D96C00",
            highlight: {
              background: "#ee6666",
              border: "#D96C00",
            },
          }, // root
        };
      }
      return node;
    });
    graphDataSet.edges = graph.edges.map((edge) => {
      if (edge.from === "c1") {
        return {
          ...edge,
          color: "#D96C00",
        };
      }
      return edge;
    });

    setGraphDataSet(graphDataSet);
    setIsReady(true);
  };

  const events = {
    select: (event) => {
      // let { nodes, edges } = event;
      // console.log(event);
    },
    doubleClick: (event) => {
      let { nodes, edges } = event;
      console.log(event);
    }
  };

  /**
   * @description 保存當前 node 位置
   */
  const onSave = () => {
    let positions = graphNetwork.getPositions();

    let newGraphDataSet = {};
    let newNodes = graphDataSet.nodes.map(node => {
      let id = node.id;
      let x = positions[id].x;
      let y = positions[id].y;

      return {
        ...node,
        x,
        y,
      }
    })
    let newEdges = graphDataSet.edges;
    
    newGraphDataSet['nodes'] = newNodes;
    newGraphDataSet['edges'] = newEdges; 

    setGraphDataSet(newGraphDataSet);
  };

  return (
    <div style={{
      width: '50vw',
      border: '1px solid'
    }}>
      {isReady && (
        <>
          <Graph
            graph={graphDataSet}
            options={options}
            events={events}
            getNetwork={(network) => {
              setGraphNetwork(network);
              //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
          />
          <button onClick={onSave}>save to json</button>
        </>
      )}
    </div>
  );
}

const graph = {
  nodes: [
    { id: "c1", x: -116, y: -122, label: "金絲竹" },
    { id: "c2", x: -262, y: -83, label: "莖" },
    { id: "c3", x: -183, y: -1, label: "葉" },
    { id: "c4", x: 4, y: 0, label: "花" },
    { id: "c5", x: 139, y: -92, label: "籜" },
    { id: "c6", x: -463, y: 4, label: "黃綠色" },
    { id: "c7", x: -440, y: -81, label: "叢生" },
    { id: "c8", x: -347, y: -157, label: "竹類" },
    { id: "c9", x: -352, y: 83, label: "條紋" },
    { id: "c10", x: -455, y: 177, label: "綠色" },
    { id: "c11", x: -188, y: 254, label: "葉序互生" },
    { id: "c12", x: -261, y: 90, label: "葉形" },
    { id: "c13", x: -316, y: 206, label: "披針形" },
    { id: "c14", x: -78, y: 155, label: "葉色" },
    { id: "c15", x: -27, y: 57, label: "複葉" },
    { id: "c16", x: -36, y: 264, label: "綠色" },
    { id: "c17", x: 39, y: 104, label: "花序" },
    { id: "c18", x: 86, y: 255, label: "圓錐狀" },
    { id: "c19", x: 181, y: 141, label: "頂生" },
    { id: "c20", x: 191, y: 32, label: "密佈細毛" },
  ],
  edges: [
    {
      id: "c1-c2",
      from: "c1",
      to: "c2",
      label: "有",
      weight: 1,
      unit: "A1",
    },
    {
      id: "c1-c3",
      from: "c1",
      to: "c3",
      label: "有",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c1-c4",
      from: "c1",
      to: "c4",
      label: "有",
      weight: 1,
      unit: "A3",
    },
    {
      id: "c1-c5",
      from: "c1",
      to: "c5",
      label: "有",
      weight: 1,
      unit: "A4",
    },
    {
      id: "c2-c6",
      from: "c2",
      to: "c6",
      label: "是",
      weight: 1,
      unit: "A1",
    },
    {
      id: "c2-c7",
      from: "c2",
      to: "c7",
      label: "是",
      weight: 1,
      unit: "A1",
    },
    {
      id: "c2-c8",
      from: "c2",
      to: "c8",
      label: "是",
      weight: 1,
      unit: "A1",
    },
    {
      id: "c2-c9",
      from: "c2",
      to: "c9",
      label: "有",
      weight: 1,
      unit: "A1",
    },
    {
      id: "c9-c10",
      from: "c9",
      to: "c10",
      label: "是",
      weight: 1,
      unit: "A1",
    },
    {
      id: "c3-c11",
      from: "c3",
      to: "c11",
      label: "的",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c3-c12",
      from: "c3",
      to: "c12",
      label: "的",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c12-c13",
      from: "c12",
      to: "c13",
      label: "是",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c3-c14",
      from: "c3",
      to: "c14",
      label: "的",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c3-c15",
      from: "c3",
      to: "c15",
      label: "是",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c14-c16",
      from: "c14",
      to: "c16",
      label: "是",
      weight: 1,
      unit: "A2",
    },
    {
      id: "c4-c17",
      from: "c4",
      to: "c17",
      label: "的",
      weight: 1,
      unit: "A3",
    },
    {
      id: "c17-c18",
      from: "c17",
      to: "c18",
      label: "是",
      weight: 1,
      unit: "A3",
    },
    {
      id: "c17-c19",
      from: "c17",
      to: "c19",
      label: "是",
      weight: 1,
      unit: "A3",
    },
    {
      id: "c5-c20",
      from: "c5",
      to: "c20",
      label: "是",
      weight: 1,
      unit: "A4",
    },
  ],
};

const options = {
  layout: {
    hierarchical: false,
  },
  physics: {
    barnesHut: {
      gravitationalConstant: 0,
      centralGravity: 0,
      springConstant: 0,
    },
  },
  edges: {
    width: 1.5,
    smooth: {
      enabled: true,
      type: "continuous",
      roundness: 0.5,
    },
  },
  nodes: {
    font: {
      size: 18,
    },
  },
  height: "500px",
  width: "50vw"
};

export default App;
