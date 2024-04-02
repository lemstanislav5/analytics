/* eslint-disable react/jsx-no-duplicate-props */
import React from "react";
import Graph from "react-graph-vis";

function VisNetwork(props) {
  const {nodes, edges, physics, setNetworkLink, setIdSelectNode} = props;
  console.log(edges)
  const graph = {
    nodes, edges
  };
  const options = {
    locale:"ru", 
    height: "800px",
    edges:{
      arrows: {
        to: {
          enabled: false, // Выключает стрелку по направлению к
        }
      }
    },
    nodes: {
      shape: "dot",
      size: 16,
    },
    physics: {
      enabled: physics,
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18,
      },
      maxVelocity: 146,
      solver: "forceAtlas2Based",
      timestep: 0.35,
      stabilization: { iterations: 1150 },
      barnesHut: {springLength:1300, springConstant: 0.4}
    },
    layout: {
      improvedLayout: true
    },
  };

  return (
    <Graph
      graph={graph}
      options={options}
      getNetwork={setNetworkLink}
      events={{
        selectEdge: (event) => {
          // setIdSelectNode(event.nodes[0])
        },
        doubleClick: (event) => {
          // setIdSelectNode(event.nodes[0])
        },
        selectNode: (event) => {
          setIdSelectNode(event.nodes[0])
        },
      }}
    />
  );
}
export default VisNetwork;