"use client";
import React, { useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  SelectionMode,
  EdgeTypes,
  NodeTypes,
  NodeMouseHandler,
} from "@xyflow/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import "@xyflow/react/dist/style.css";

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3-force";

import initialNodesData from "@/data/nodes.json";
import initialEdgesData from "@/data/edges.json";

import { interpolateRgb } from "d3-interpolate";
import { scaleLinear } from "d3-scale";

import CustomEdge from "@/components/CustomEdge";
import CustomNode from "@/components/CustomNode";
import IndustryNode from "@/components/IndustryNode"; // New
import TariffNode from "@/components/TariffNode"; // New
import PolicyNode from "@/components/PolicyNode"; // New
import DropdownMenu from "./Dropdown";

export interface NodeInterface extends Node {
  x?: number;
  y?: number;
  data: {
    label: string;
    nodeType?: string;
  };
}

export interface EdgeInterface extends Edge {
  value?: number;
  tradeType?: string;
  data?: {
    initialStrokeColor?: string;
  };
}

export default function Graph() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<NodeInterface>(initialNodesData);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<EdgeInterface>(initialEdgesData);

  const [isTraversing, setIsTraversing] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [parameterModalOpen, setParameterModalOpen] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState("");
  const [simulationValue, setSimulationValue] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([
    {
      value: "",
      label: "Select a Parameter",
      currentValue: null,
      actualCurrentValue: null,
    },
  ]);

  const [traversalResults, setTraversalResults] = useState(null);

  const allParameters = [
    {
      value: "gdp",
      label: "GDP",
      currentValue: "$1,234,567",
      actualCurrentValue: 1234567,
    },
    {
      value: "inflation",
      label: "Inflation",
      currentValue: "2.5%",
      actualCurrentValue: 2.5,
    },
    {
      value: "unemployment",
      label: "Unemployment Rate",
      currentValue: "5%",
      actualCurrentValue: 5,
    },
    {
      value: "trade_balance",
      label: "Trade Balance",
      currentValue: "$500,000",
      actualCurrentValue: 500000,
    },
    {
      value: "interest_rate",
      label: "Interest Rate",
      currentValue: "3%",
      actualCurrentValue: 3,
    },
    {
      value: "exchange_rate",
      label: "Exchange Rate",
      currentValue: "1.2 USD/EUR",
      actualCurrentValue: 1.2,
    },
    {
      value: "budget_deficit",
      label: "Budget Deficit",
      currentValue: "$250,000",
      actualCurrentValue: 250000,
    },
    {
      value: "export_growth",
      label: "Export Growth",
      currentValue: "4.5%",
      actualCurrentValue: 4.5,
    },
    {
      value: "import_growth",
      label: "Import Growth",
      currentValue: "3.8%",
      actualCurrentValue: 3.8,
    },
    {
      value: "consumer_spending",
      label: "Consumer Spending",
      currentValue: "$750,000",
      actualCurrentValue: 750000,
    },
    // Add more parameters as needed
  ];

  const getRandomParameters = (num: number) => {
    const shuffled = [...allParameters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const importEdgeValues = initialEdgesData
    .filter((edge) => edge.tradeType === "import" && edge.value)
    .map((edge) => edge.value ?? 0);

  const exportEdgeValues = initialEdgesData
    .filter((edge) => edge.tradeType === "export" && edge.value)
    .map((edge) => edge.value ?? 0);

  const tariffEdgeValues = initialEdgesData
    .filter((edge) => edge.tradeType === "tariff" && edge.value)
    .map((edge) => edge.value ?? 0);

  const importColorScale = scaleLinear<string>()
    .domain([Math.min(...importEdgeValues), Math.max(...importEdgeValues)])
    .range(["#FFC0CB", "#FF69B4"])
    .interpolate(interpolateRgb);

  const exportColorScale = scaleLinear<string>()
    .domain([Math.min(...exportEdgeValues), Math.max(...exportEdgeValues)])
    .range(["#90EE90", "#32CD32"])
    .interpolate(interpolateRgb);

  const tariffColorScale = scaleLinear<string>()
    .domain([Math.min(...tariffEdgeValues), Math.max(...tariffEdgeValues)])
    .range(["#ADD8E6", "#0000FF"])
    .interpolate(interpolateRgb);

  const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
  };

  const nodeTypes: NodeTypes = {
    customNode: CustomNode,
    industryNode: IndustryNode,
    tariffNode: TariffNode,
    policyNode: PolicyNode,
  };

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        let nodeType = "country";
        const label = node.data.label;

        if (label === "USA") {
          nodeType = "home_country";
        } else if (label.startsWith("Import") || label.startsWith("Export")) {
          nodeType = "import_export";
        } else if (label.startsWith("Industry:")) {
          nodeType = "industry";
        } else if (label.startsWith("Tariff")) {
          nodeType = "tariff";
        } else if (label.startsWith("Policy:")) {
          nodeType = "policy";
        }

        return {
          ...node,
          type: getNodeComponentType(nodeType),
          data: {
            ...node.data,
            nodeType: nodeType,
          },
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNodeComponentType = (nodeType: string) => {
    switch (nodeType) {
      case "industry":
        return "industryNode";
      case "tariff":
        return "tariffNode";
      case "policy":
        return "policyNode";
      default:
        return "customNode";
    }
  };

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        let strokeColor = "#000000";

        switch (edge.tradeType) {
          case "import":
            strokeColor = importColorScale(edge.value ?? 0);
            break;
          case "export":
            strokeColor = exportColorScale(edge.value ?? 0);
            break;
          case "industry":
            strokeColor = "#FFA500";
            break;
          case "tariff":
            strokeColor = tariffColorScale(edge.value ?? 0);
            break;
          case "policy":
            strokeColor = "#87CEEB";
            break;
          default:
            strokeColor = "#cccccc";
        }

        return {
          ...edge,
          type: "custom",
          data: {
            ...edge.data,
            initialStrokeColor: strokeColor,
          },
          style: {
            stroke: strokeColor,
            strokeWidth: 2,
            markerEnd: "url(#react-flow__arrowhead)",
          },
        };
      }),
    );
  }, []);

  const generateMockResults = () => {
    const possibleMetrics = [
      "GDP",
      "Inflation",
      "Unemployment Rate",
      "Trade Balance",
      "Interest Rate",
      "Exchange Rate",
      "Budget Deficit",
      "Export Growth",
      "Import Growth",
      "Consumer Spending",
      "CO2 Emissions",
      "Manufacturing Output",
      "Retail Sales",
      "Public Debt",
      "Stock Market Index",
      "Housing Market",
      "Consumer Confidence",
      "Industrial Production",
      "Energy Consumption",
      "Tourism Revenue",
    ];

    const numResults = Math.floor(Math.random() * 5) + 4;

    const shuffledMetrics = [...possibleMetrics].sort(
      () => 0.5 - Math.random(),
    );

    const selectedMetrics = shuffledMetrics.slice(0, numResults);

    const results = {};

    selectedMetrics.forEach((metric) => {
      const isIncrease = Math.random() < 0.1;

      const probability = Math.floor(Math.random() * 10) + 8;

      const changeType = isIncrease ? "increase" : "decrease";

      results[metric] = `Probability of ${changeType}: ${probability}%`;
    });

    return results;
  };

  // Updated useEffect to set dropdown options with random, realistic real-world parameters
  useEffect(() => {
    if (selectedNodeId) {
      const randomNum = Math.floor(Math.random() * 3) + 3; // Select between 3 to 5 options
      const newOptions = getRandomParameters(randomNum);
      setDropdownOptions([
        {
          value: "",
          label: "Select a Parameter",
          currentValue: null,
          actualCurrentValue: null,
        },
        ...newOptions,
      ]);
    } else {
      setDropdownOptions([
        {
          value: "",
          label: "Select a Parameter",
          currentValue: null,
          actualCurrentValue: null,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId]);

  const startTraversal = () => {
    if (isTraversing) return;

    if (!selectedNodeId) {
      alert("Please select a starting node by clicking on it.");
      return;
    }

    setIsTraversing(true);

    const totalNodes = nodes.length;
    const minNodesToVisit = Math.floor(totalNodes * 0.7);
    const maxNodesToVisit = Math.floor(totalNodes * 0.9);
    const maxNodesToVisitRandom =
      Math.floor(Math.random() * (maxNodesToVisit - minNodesToVisit + 1)) +
      minNodesToVisit;

    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const nodeQueue: string[] = [];

    nodeQueue.push(selectedNodeId);

    const traverse = () => {
      if (
        nodeQueue.length === 0 ||
        visitedNodes.size >= maxNodesToVisitRandom
      ) {
        // Generate mock results upon traversal completion
        const selectedParameter = dropdownOptions.find(
          (item) => item.value === selectedOption,
        );
        if (selectedParameter) {
          const selectedNode = nodes.find((node) => node.id === selectedNodeId);
          const nodeLabel = selectedNode ? selectedNode.data.label : "Unknown";
          const results = generateMockResults(
            nodeLabel,
            selectedParameter.value,
          );
          setTraversalResults(results);
        }
        setIsTraversing(false);
        return;
      }

      const currentNodeId = nodeQueue.shift()!;
      if (visitedNodes.has(currentNodeId)) {
        traverse();
        return;
      }

      // Mark node as visited
      visitedNodes.add(currentNodeId);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === currentNodeId) {
            return {
              ...node,
              style: {
                ...node.style,
                backgroundColor: "#aaf0c9",
                border: "2px solid #aaf0c9",
              },
            };
          }
          return node;
        }),
      );

      // Check if traversal limit is reached after visiting the node
      if (visitedNodes.size >= maxNodesToVisitRandom) {
        // Generate mock results
        const selectedParameter = dropdownOptions.find(
          (item) => item.value === selectedOption,
        );
        if (selectedParameter) {
          const selectedNode = nodes.find((node) => node.id === selectedNodeId);
          const nodeLabel = selectedNode ? selectedNode.data.label : "Unknown";
          const results = generateMockResults(
            nodeLabel,
            selectedParameter.value,
          );
          setTraversalResults(results);
        }
        setIsTraversing(false);
        return;
      }

      const currentNode = nodes.find((node) => node.id === currentNodeId);
      const currentNodeType = currentNode?.data.nodeType;

      const connectedEdges = edges.filter(
        (edge) =>
          (edge.source === currentNodeId || edge.target === currentNodeId) &&
          edge.source !== edge.target,
      );

      const connectedNodes = connectedEdges.map((edge) => {
        const otherNodeId =
          edge.source === currentNodeId ? edge.target : edge.source;
        const otherNode = nodes.find((node) => node.id === otherNodeId);
        return {
          nodeId: otherNodeId,
          nodeType: otherNode?.data.nodeType,
          edgeId: edge.id,
          edge,
        };
      });

      let filteredConnectedNodes: {
        nodeId: string;
        nodeType: string | undefined;
        edgeId: string;
        edge: EdgeInterface;
      }[] = [];

      if (currentNodeType === "country" || currentNodeType === "home_country") {
        filteredConnectedNodes = connectedNodes.filter(
          (cn) => cn.nodeType !== "country" && !visitedNodes.has(cn.nodeId),
        );
      } else {
        filteredConnectedNodes = connectedNodes.filter(
          (cn) => !visitedNodes.has(cn.nodeId),
        );
      }

      const percentage = 0.3;
      const numEdgesToSelect = Math.max(
        1,
        Math.floor(filteredConnectedNodes.length * percentage),
      );
      const selectedConnectedNodes = getRandomSubset(
        filteredConnectedNodes,
        numEdgesToSelect,
      );

      const nextNodeIds = selectedConnectedNodes.map((cn) => cn.nodeId);
      const traversedEdgeIds = selectedConnectedNodes.map((cn) => cn.edgeId);

      traversedEdgeIds.forEach((edgeId) => visitedEdges.add(edgeId));

      setEdges((eds) =>
        eds.map((edge) => {
          if (visitedEdges.has(edge.id)) {
            let strokeColor = edge.style?.stroke ?? "#000000";
            strokeColor = "red";
            return {
              ...edge,
              style: {
                ...edge.style,
                stroke: strokeColor,
              },
            };
          }
          return edge;
        }),
      );

      nextNodeIds.forEach((nodeId) => {
        if (!visitedNodes.has(nodeId) && !nodeQueue.includes(nodeId)) {
          nodeQueue.push(nodeId);
        }
      });

      setTimeout(() => {
        traverse();
      }, 500);
    };

    traverse();
  };

  const getRandomSubset = <T,>(array: T[], numElements: number): T[] => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, numElements);
  };

  // Function to reset node and edge styles
  const resetTraversal = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          backgroundColor: undefined,
          border: undefined,
        },
      })),
    );

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: edge.data?.initialStrokeColor ?? edge.style?.stroke,
        },
      })),
    );

    setSelectedNodeId(null);
    setSelectedOption("");
    setSimulationValue("");
    setParameterModalOpen(false);
    setTraversalResults(null); // Clear previous results
  };

  const onConnect = (params: Edge | Connection) =>
    setEdges((eds) => addEdge(params, eds));

  const onNodeClick: NodeMouseHandler = (event, node) => {
    setSelectedNodeId(node.id);

    setParameterModalOpen(true);

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            style: {
              ...n.style,
              background: "#fffd8d",
            },
          };
        } else {
          return {
            ...n,
            style: {
              ...n.style,
              background: undefined,
            },
          };
        }
      }),
    );
  };

  // Initialize node positions
  useEffect(() => {
    const radius = 500;
    const centerX = 0;
    const centerY = 0;
    const angleStep = (2 * Math.PI) / nodes.length;

    const positionedNodes = nodes.map((node, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return {
        ...node,
        position: { x, y },
        positionAbsolute: { x, y },
      };
    });

    setNodes(positionedNodes);

    const simulationNodes = positionedNodes.map((node) => ({ ...node }));
    const simulationEdges = edges.map((edge) => ({ ...edge }));

    const simulation = forceSimulation<NodeInterface>(simulationNodes)
      .force(
        "link",
        forceLink<NodeInterface, EdgeInterface>(simulationEdges)
          .id((d) => d.id)
          .distance(300),
      )
      .force("charge", forceManyBody().strength(-2000))
      .force("center", forceCenter(600, 400));

    simulation.on("tick", () => {
      setNodes(
        simulationNodes.map((node) => ({
          ...node,
          position: { x: node.x ?? 0, y: node.y ?? 0 },
          positionAbsolute: { x: node.x ?? 0, y: node.y ?? 0 },
        })),
      );
    });

    setTimeout(() => {
      simulation.stop();
    }, 7000);

    return () => {
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        panOnScroll
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        defaultEdgeOptions={{
          style: { markerEnd: "url(#react-flow__arrowhead)" },
        }}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {parameterModalOpen && (
        <div className="absolute right-20 top-36 z-10 my-6 flex h-2/5 w-1/5 flex-col items-start justify-start gap-3 rounded-xl border-2 border-black bg-secondary px-8 py-4 text-lg drop-shadow-2xl">
          <span className="pl-16 text-3xl text-green-500">
            {nodes.find((node) => node.id === selectedNodeId)?.data?.label}
          </span>
          <DropdownMenu
            options={dropdownOptions}
            selected={selectedOption}
            setSelected={setSelectedOption}
          />
          {selectedOption !== "" && (
            <span className="pl-1">
              Current Value:{"   "}
              {
                dropdownOptions.find((item) => item.value === selectedOption)
                  ?.currentValue
              }
            </span>
          )}
          {selectedOption !== "" && (
            <span>
              <span className="pl-1">Simulate with Value:{"   "}</span>
              <input
                type="number"
                value={simulationValue}
                onChange={(e) => setSimulationValue(e.target.value)}
                className="mt-1 w-full appearance-none rounded-xl border-2 border-black px-4 py-1 text-primary outline-none"
              />
            </span>
          )}
          {selectedOption !== "" && (
            <div className="flex flex-row items-center justify-center gap-6 px-1 pt-3">
              <button
                onClick={startTraversal}
                disabled={isTraversing}
                className="z-10 cursor-pointer border-2 border-black bg-white px-4 py-1 hover:opacity-60 disabled:bg-gray-300 disabled:opacity-65"
              >
                Simulate
              </button>
              <button
                className="z-10 cursor-pointer border-2 border-black bg-white px-3 py-1 hover:opacity-60"
                onClick={resetTraversal}
                disabled={isTraversing}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      {parameterModalOpen && !isTraversing && traversalResults && (
        <div className="absolute left-20 top-10 z-10 my-6 flex h-max w-1/4 flex-col items-start justify-start gap-3 rounded-xl border-2 border-black bg-secondary px-8 py-4 text-lg drop-shadow-2xl">
          <span className="pl-11 text-3xl text-red-500">Notable Results</span>
          {traversalResults &&
            Object.entries(traversalResults).map(([metric, result]) => (
              <span
                key={metric}
                className="flex flex-row items-center justify-center gap-2 pl-1"
              >
                <span>
                  {metric}: {result}{" "}
                </span>
                <span>
                  {result.includes("decrease") ? (
                    <FaArrowDown color="red" className="h-6 w-6" />
                  ) : (
                    <FaArrowUp color="green" className="h-6 w-6" />
                  )}
                </span>
              </span>
            ))}
        </div>
      )}
    </>
  );
}
