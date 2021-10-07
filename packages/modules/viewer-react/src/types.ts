/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Vector3d, XAndY, XYAndZ } from "@bentley/geometry-core";
import { IModelClient } from "@bentley/imodelhub-client";
import {
  ColorDef,
  RenderMode,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@bentley/imodeljs-common";
import {
  IModelConnection,
  ScreenViewport,
  StandardViewId,
  ToolAdmin,
  ViewChangeOptions,
  ViewState,
} from "@bentley/imodeljs-frontend";
import { BackstageItem, UiItemsProvider } from "@bentley/ui-abstract";
import {
  ColorTheme,
  FrameworkVersion,
  FrontstageProvider,
  IModelViewportControlOptions,
} from "@bentley/ui-framework";

/**
 * options for configuration of 3D view
 */
export interface ViewCreator3dOptions {
  /** Turn [[Camera]] on when generating the view. */
  cameraOn?: boolean;
  /** Turn [[SkyBox]] on when generating the view. */
  skyboxOn?: boolean;
  /** [[StandardViewId]] for the view state. */
  standardViewId?: StandardViewId;
  /** Merge in props from the seed view (default spatial view) of the iModel.  */
  useSeedView?: boolean;
  /** Aspect ratio of [[Viewport]]. Required to fit contents of the model(s) in the initial state of the view. */
  vpAspect?: number;
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

export interface IModelLoaderParams {
  /** color theme */
  theme?: ColorTheme | string;
  /** Default UI configuration */
  defaultUiConfig?: ItwinViewerUi;
  /** Optional callback function when iModel is connected */
  onIModelConnected?: (iModel: IModelConnection) => void;
  /** additional frontstages to register */
  frontstages?: ViewerFrontstage[];
  /** menu items for the backstage */
  backstageItems?: ViewerBackstageItem[];
  /** optionally override the UI framework version (defaults to 2) */
  uiFrameworkVersion?: FrameworkVersion;
  /** additional viewport options for the default frontstage's viewport control */
  viewportOptions?: ViewerViewportControlOptions;
  /** UI Providers to register https://www.itwinjs.org/learning/ui/abstract/uiitemsprovider/ */
  uiProviders?: UiItemsProvider[];
  /** options for creating the default viewState */
  viewCreatorOptions?: ViewCreator3dOptions;
}

export interface ItwinViewerCommonParams
  extends ItwinViewerInitializerParams,
    IModelLoaderParams {}

export interface ItwinViewerInitializerParams {
  [index: string]: any;
  /** optional Azure Application Insights key for telemetry */
  appInsightsKey?: string;
  /** optional iTwin.js Application Insights key for telemetry within iTwin.js */
  imjsAppInsightsKey?: string;
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
  /** override the default message that sends users to the iTwin Synchronizer when there are data-related errors with an iModel. Pass empty string to override with no message. */
  iModelDataErrorMessage?: string;
  /** optional ToolAdmin to initialize */
  toolAdmin?: ToolAdmin;
  /** option imodelClient (defaults to iModelHubClient) */
  imodelClient?: IModelClient;
}

/**
 * Maintain a list of initilalizer params for use in useBaseViewerInitializer
 * This list MUST match what is in the ItwinViewerInitializerParams interface and should be updated as new properties are added/removed
 */
const iTwinViewerInitializerParamSample: ItwinViewerInitializerParams = {
  appInsightKey: undefined,
  imjsAppInsightsKey: undefined,
  productId: undefined,
  i18nUrlTemplate: undefined,
  onIModelAppInit: undefined,
  additionalI18nNamespaces: undefined,
  additionalRpcInterfaces: undefined,
  iModelDataErrorMessage: undefined,
  toolAdmin: undefined,
  imodelClient: undefined,
};
export const iTwinViewerInitializerParamList = Object.keys(
  iTwinViewerInitializerParamSample
) as (keyof ItwinViewerInitializerParams)[];

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
}

export interface BlankConnectionViewState {
  setAllow3dManipulations?: boolean;
  lookAt?: BlankConnectionViewStateLookAt;
  displayStyle?: BlankConnectionViewStateDisplayStyle;
  viewFlags?: BlankConnectionViewStateViewFlags;
}
