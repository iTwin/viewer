/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BackstageItem, UiItemsProvider } from "@itwin/appui-abstract";
import type {
  ColorTheme,
  FrontstageProvider,
  IModelViewportControlOptions,
} from "@itwin/appui-react";
import type {
  ColorDef,
  RenderMode,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@itwin/core-common";
import type {
  BlankConnectionProps,
  BuiltInExtensionLoaderProps,
  IModelAppOptions,
  IModelConnection,
  ScreenViewport,
  ViewChangeOptions,
  ViewCreator3dOptions,
  ViewState,
} from "@itwin/core-frontend";
import type { Vector3d, XAndY, XYAndZ } from "@itwin/core-geometry";

export type Without<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]?: never };
// eslint-disable-next-line @typescript-eslint/ban-types
export type XOR<T1, T2> = T1 | T2 extends {}
  ? (Without<T1, T2> & T2) | (Without<T2, T1> & T1)
  : T1 | T2;

/**
 * options for configuration of 3D view
 */
export interface ViewerViewCreator3dOptions extends ViewCreator3dOptions {
  /** optional function to configure the viewport on load */
  viewportConfigurer?: (viewport: ScreenViewport) => void;
}

export interface ViewerFrontstage {
  /** frontstage provider to register */
  provider: FrontstageProvider;
  /** should this be the default frontstage? If multiple are defined as default, the last will be used */
  default?: boolean;
  /** the frontstage requires an iModel connection */
  requiresIModelConnection?: boolean;
}

export type ViewerBackstageItem = BackstageItem & {
  labeli18nKey?: string;
};

export interface ViewerViewportControlOptions
  extends Omit<IModelViewportControlOptions, "viewState"> {
  /** ViewState or a function to return a ViewState */
  viewState?:
    | ViewState
    | ((iModelConnection: IModelConnection) => ViewState)
    | ((iModelConnection: IModelConnection) => Promise<ViewState>);
}

export interface LoaderProps {
  /** color theme */
  theme?: ColorTheme | string;
  /** Default UI configuration */
  defaultUiConfig?: ItwinViewerUi;
  /** Optional callback function when iModel is connected */
  onIModelConnected?:
    | ((iModel: IModelConnection) => void)
    | ((iModel: IModelConnection) => Promise<void>);
  /** additional frontstages to register */
  frontstages?: ViewerFrontstage[];
  /** menu items for the backstage */
  backstageItems?: ViewerBackstageItem[];
  /** additional viewport options for the default frontstage's viewport control */
  viewportOptions?: ViewerViewportControlOptions;
  /** [UI Providers](https://www.itwinjs.org/learning/ui/abstract/uiitemsprovider/) to register */
  uiProviders?: UiItemsProvider[];
  /** options for creating the default viewState */
  viewCreatorOptions?: ViewerViewCreator3dOptions;
  /** Component to show when loading iModel key */
  loadingComponent?: React.ReactNode;
}

export type ViewerCommonProps = ViewerInitializerParams & LoaderProps;

export type ViewerIModelAppOptions = Pick<
  IModelAppOptions,
  "hubAccess" | "mapLayerOptions" | "tileAdmin" | "toolAdmin"
>;

export interface ViewerInitializerParams extends ViewerIModelAppOptions {
  /**
   * Enable reporting data from timed events in the iTwin Viewer.
   * The data is anonynmous numerics and will help to increase Viewer performance in future releases.
   * See the Web or Desktop Viewer package [README](https://www.npmjs.com/package/@itwin/web-viewer-react) for additional details.
   */
  enablePerformanceMonitors: boolean;
  /** optional Azure Application Insights key for telemetry */
  appInsightsKey?: string;
  /** GPRID for the consuming application. Will default to the iTwin Viewer GPRID */
  productId?: string;
  /** urlTemplate for querying i18n json files */
  i18nUrlTemplate?: string;
  /** callback after iModelApp is initialized */
  onIModelAppInit?: () => void;
  /** additional i18n namespaces to register */
  additionalI18nNamespaces?: string[];
  /** custom rpc interfaces (assumes that they are supported in your backend) */
  additionalRpcInterfaces?: RpcInterfaceDefinition<RpcInterface>[];
  /** TODO build time only for now */
  extensions?: BuiltInExtensionLoaderProps[];
}

export interface ConnectedViewerProps {
  iTwinId: string;
  iModelId: string;
  changeSetId?: string;
}

export interface FileViewerProps {
  /** Path to local snapshot or briefcase */
  filePath: string;
}

export interface BlankViewerProps {
  blankConnection: BlankConnectionProps;
  blankConnectionViewState?: BlankConnectionViewState;
}

/**
 * Maintain a list of initilalizer params for use in useBaseViewerInitializer
 * This list MUST match what is in the ViewerInitializerParams interface and should be updated as new properties are added/removed
 */
const iTwinViewerInitializerParamSample: ViewerInitializerParams = {
  appInsightsKey: undefined,
  productId: undefined,
  i18nUrlTemplate: undefined,
  onIModelAppInit: undefined,
  additionalI18nNamespaces: undefined,
  additionalRpcInterfaces: undefined,
  toolAdmin: undefined,
  hubAccess: undefined,
  mapLayerOptions: undefined,
  extensions: undefined,
  enablePerformanceMonitors: false,
  tileAdmin: undefined,
};

export const iTwinViewerInitializerParamList = Object.keys(
  iTwinViewerInitializerParamSample
);

/**
 * Configure options for the top left corner item
 */
export interface CornerItem {
  hideDefault?: boolean;
  item?: React.ReactNode;
}

/**
 * Control visibility of individual tools or tool groups in the content manipulation vertical section. Default is true
 */
export interface ContentManipulationVerticalItems {
  selectTool?: boolean;
  measureTools?: boolean;
  sectionTools?: boolean;
}

/**
 * Control visibility of individual tools or tool groups in the content manipulation horizontal section. Default is true
 */
export interface ContentManipulationHorizontalItems {
  clearSelection?: boolean;
  clearHideIsolateEmphasizeElements?: boolean;
  hideElements?: boolean;
  isolateElements?: boolean;
  emphasizeElements?: boolean;
}

/**
 * Configure options for the content manipulation section
 */
export interface ContentManipulationTools {
  cornerItem?: CornerItem;
  hideDefaultHorizontalItems?: boolean;
  hideDefaultVerticalItems?: boolean;
  verticalItems?: ContentManipulationVerticalItems;
  horizontalItems?: ContentManipulationHorizontalItems;
}

/**
 * Control visibility of individual tools or tool groups in the view navigation horizontal section. Default is true
 */
export interface ViewNavigationHorizontalItems {
  rotateView?: boolean;
  panView?: boolean;
  fitView?: boolean;
  windowArea?: boolean;
  undoView?: boolean;
  redoView?: boolean;
}

/**
 * Control visibility of individual tools or tool groups in the view navigation vertical section. Default is true
 */
export interface ViewNavigationVerticalItems {
  walkView?: boolean;
  cameraView?: boolean;
}

/**
 * Configure options for the navigation section
 */
export interface ViewNavigationTools {
  hideDefaultHorizontalItems?: boolean;
  hideDefaultVerticalItems?: boolean;
  verticalItems?: ViewNavigationVerticalItems;
  horizontalItems?: ViewNavigationHorizontalItems;
}

/**
 * Configure options for the default UI
 */
export interface ItwinViewerUi {
  contentManipulationTools?: ContentManipulationTools;
  navigationTools?: ViewNavigationTools;
  hideToolSettings?: boolean;
  hideTreeView?: boolean;
  hidePropertyGrid?: boolean;
  hideDefaultStatusBar?: boolean;
}

/**
 * Blank connection ViewState types
 */
export interface BlankConnectionViewStateLookAt {
  eyePoint: XYAndZ;
  targetPoint: XYAndZ;
  upVector: Vector3d;
  newExtents?: XAndY;
  frontDistance?: number;
  backDistance?: number;
  opts?: ViewChangeOptions;
}

export interface BlankConnectionViewStateDisplayStyle {
  backgroundColor?: ColorDef;
}

export interface BlankConnectionViewStateViewFlags {
  grid?: boolean;
  renderMode?: RenderMode;
  backgroundMap?: boolean;
}

export interface BlankConnectionViewState {
  setAllow3dManipulations?: boolean;
  lookAt?: BlankConnectionViewStateLookAt;
  displayStyle?: BlankConnectionViewStateDisplayStyle;
  viewFlags?: BlankConnectionViewStateViewFlags;
}
