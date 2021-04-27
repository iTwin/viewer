/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@bentley/frontend-authorization-client";
import { Vector3d, XAndY, XYAndZ } from "@bentley/geometry-core";
import {
  BentleyCloudRpcParams,
  ColorDef,
  NativeAppAuthorizationConfiguration,
  RenderMode,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@bentley/imodeljs-common";
import {
  IModelConnection,
  NativeAppAuthorization,
  ViewChangeOptions,
} from "@bentley/imodeljs-frontend";
import { BackstageItem, UiItemsProvider } from "@bentley/ui-abstract";
import {
  ColorTheme,
  FrameworkVersion,
  FrontstageProvider,
  IModelViewportControlOptions,
} from "@bentley/ui-framework";

/**
 * List of possible hosted backends that the iTwin Viewer can use
 */
export enum IModelBackend {
  GeneralPurpose = "general-purpose-imodeljs-backend",
}

/**
 * Host type (Service Fabric or Kubernetes)
 */
export enum IModelBackendHost {
  ServiceFabric = "SF",
  K8S = "K8S",
}

/**
 * Hosted backend configuration
 */
export interface HostedBackendConfig {
  /* title for rpc config */
  title: IModelBackend | string;
  /* SF/K8S */
  hostType: IModelBackendHost;
  /* in the form "vx.x" */
  version: string;
}

/**
 * Custom rpc configuration
 */
export interface CustomBackendConfig {
  rpcParams: BentleyCloudRpcParams;
}

/**
 * Authorization options. Must provide one.
 */
export interface AuthorizationOptions {
  /** provide an existing iModel.js authorization client */
  oidcClient?: BrowserAuthorizationClient | NativeAppAuthorization;
  /** provide configuration for an oidc client to be managed within the Viewer */
  config?:
    | BrowserAuthorizationClientConfiguration
    | NativeAppAuthorizationConfiguration;
}

/**
 * Backend configuration
 */
export interface IModelBackendOptions {
  hostedBackend?: HostedBackendConfig;
  customBackend?: CustomBackendConfig;
  buddiRegion?: number;
  buddiServer?: string;
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

/**
 * iTwin Viewer parameter list
 */
export interface ItwinViewerParams extends ItwinViewerCommonParams {
  /** id of the html element where the viewer should be rendered */
  elementId: string;
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
  viewportOptions?: IModelViewportControlOptions;
  /** UI Providers to register https://www.itwinjs.org/learning/ui/abstract/uiitemsprovider/ */
  uiProviders?: UiItemsProvider[];
  /** iModel.js extensions to load */
  extensions?: ViewerExtension[];
}

export interface ItwinViewerCommonParams
  extends ItwinViewerInitializerParams,
    IModelLoaderParams {}

export interface ItwinViewerInitializerParams {
  /** optional Azure Application Insights key for telemetry */
  appInsightsKey?: string;
  /** optional iModel.js Application Insights key for telemetry within iModel.js */
  imjsAppInsightsKey?: string;
  /** options to override the default backend (general-purpose-imodeljs-backend) */
  backend?: IModelBackendOptions;
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
}

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
 * Extension options
 */
export interface ViewerExtension {
  name: string;
  url?: string;
  version?: string;
  args?: string[];
}

export interface ExtensionUrl {
  url: string;
  loaded: boolean;
}

export interface ExtensionInstance {
  name: string;
  loaded: boolean;
  version?: string;
  args?: string[];
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
