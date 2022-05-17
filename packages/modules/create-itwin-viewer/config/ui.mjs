export const uiConfigurations = {
  Basic: {
    description: "Basic (Empty Viewer with a navigation cube)",
    config: {
      statusBar: false,
    },
  },
  Intermediate: {
    description:
      "Intermediate (Basic + navigation tools, a selection tool, measurement tools, and a status bar)",
    config: {
      statusBar: true,
    },
  },
  Advanced: {
    description:
      "Advanced (Intermediate + sectioning tools, a property grid, and a tree view)",
    config: {
      statusBar: true,
    },
    dependencies: {
      "@itwin/tree-widget-react": "^0.3.0",
      "@itwin/property-grid-react": "^0.3.0",
    },
  },
};
