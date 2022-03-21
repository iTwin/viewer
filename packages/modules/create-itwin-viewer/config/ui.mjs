export const uiConfigurations = {
  Basic: {
    description: "Basic (Empty Viewer with a navigation cube)",
    config: {
      statusBar: false,
      tools: [],
      widgets: [],
    },
  },
  Intermediate: {
    description:
      "Intermediate (Basic + navigation tools, a selection tool, measurement tools, and a status bar)",
    config: {
      statusBar: true,
      tools: [],
      widgets: [],
    },
  },
  Advanced: {
    description:
      "Advanced (Intermediate + sectioning tools, a property grid, and a tree view)",
    config: {
      statusBar: true,
      tools: [],
      widgets: [],
    },
    dependencies: {
      "@itwin/tree-widget-react": "^0.3.0",
      "@itwin/property-grid-react": "^0.3.0",
    },
  },
};
