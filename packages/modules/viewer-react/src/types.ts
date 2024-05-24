/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BackstageItem,
  ColorTheme,
  FrontstageProvider,
  IModelViewportControlOptions,
  StandardFrontstageProps,
  UiItemsProvider,
} from "@itwin/appui-react";
import type {
  Cartographic,
  ColorDef,
  EcefLocationProps,
  RenderMode,
} from "@itwin/core-common";
import type {
  ExtensionProvider,
  IModelAppOptions,
  IModelConnection,
  ScreenViewport,
  ViewChangeOptions,
  ViewCreator3dOptions,
  ViewState,
} from "@itwin/core-frontend";
import type {
  Range3dProps,
  Vector3d,
  XAndY,
  XYAndZ,
} from "@itwin/core-geometry";
import { PresentationProps } from "@itwin/presentation-frontend";

export type Without<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]?: never };
export type XOR<T1, T2> = T1 | T2 extends Record<string, unknown>
  ? (Without<T1, T2> & T2) | (Without<T2, T1> & T1)
  : T1 | T2;

/**
 * Converts the following optional arg foo of type T
 * foo?: T
 * to a required arg with union of type T and undefined
 * foo: T | undefined
 */
export type OptionalToUndefinedUnion<T> = {
  [P in keyof Required<T>]: T[P] | undefined;
};

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
  defaultUiConfig?: ViewerDefaultFrontstageConfig;
  /** Optional callback function when iModel is connected */
  onIModelConnected?:
    | ((iModel: IModelConnection) => void)
    | ((iModel: IModelConnection) => Promise<void>);
  /** additional frontstages to register */
  frontstages?: ViewerFrontstage[];
  /** menu items for the backstage
   * @deprecated in 4.x. Use [UiItemsProvider.provideBackstageItems](https://www.itwinjs.org/reference/appui-react/uiprovider/uiitemsprovider/).
   */
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

// Note: When updating this, also update getIModelAppOptions
export type ViewerIModelAppOptions = Pick<
  IModelAppOptions,
  | "hubAccess"
  | "localization"
  | "mapLayerOptions"
  | "notifications"
  | "tileAdmin"
  | "toolAdmin"
  | "renderSys"
  | "realityDataAccess"
  | "userPreferences"
>;

export interface ViewerInitializerParams extends ViewerIModelAppOptions {
  /**
   * Enable reporting data from timed events in the iTwin Viewer.
   * The data is anonymous numerics and will help to increase Viewer performance in future releases.
   * See the [Web](https://www.npmjs.com/package/@itwin/web-viewer-react) or
   * [Desktop](https://www.npmjs.com/package/@itwin/desktop-viewer-react) Viewer package READMEs for additional details.
   */
  enablePerformanceMonitors: boolean;
  /** GPRID for the consuming application. Will default to the iTwin Viewer GPRID */
  productId?: string;
  /** urlTemplate for querying i18n json files */
  i18nUrlTemplate?: string;
  /** callback after iModelApp is initialized */
  onIModelAppInit?: () => void;
  /** additional i18n namespaces to register */
  additionalI18nNamespaces?: string[];
  /** array of iTwin.js Extensions */
  extensions?: ExtensionProvider[];
  /** Props for presentation initialization */
  presentationProps?: PresentationProps
}
export type RequiredViewerProps = XOR<
  XOR<ConnectedViewerProps, FileViewerProps>,
  BlankViewerProps
>;

export type ModelLoaderProps = Partial<
  ConnectedViewerProps & FileViewerProps & BlankViewerProps
> &
  LoaderProps;

export type ViewerProps = RequiredViewerProps & ViewerCommonProps;
export type ViewerLoaderProps = RequiredViewerProps & LoaderProps;

export type ConnectedViewerProps = {
  iTwinId: string;
  iModelId: string;
  changeSetId?: string;
};
export type FileViewerProps = {
  /** Path to local snapshot or briefcase */
  filePath: string;
  /** @alpha If false, open the briefcase in write mode; defaults to true */
  readonly?: boolean;
};

// it's fine to say that if either location or extents is defined, then both have to be defined.
export type BlankViewerProps = {
  blankConnectionViewState?: BlankConnectionViewState;
  location?: Cartographic | EcefLocationProps;
  extents?: Range3dProps;
  iTwinId?: string;
};

/**
 * Maintain a list of initializer params for use in useBaseViewerInitializer
 * This list MUST match what is in the ViewerInitializerParams interface and should be updated as new properties are added/removed
 */
const iTwinViewerInitializerParamSample: OptionalToUndefinedUnion<ViewerInitializerParams> =
  {
    hubAccess: undefined,
    localization: undefined,
    mapLayerOptions: undefined,
    notifications: undefined,
    tileAdmin: undefined,
    toolAdmin: undefined,
    renderSys: undefined,
    realityDataAccess: undefined,
    enablePerformanceMonitors: undefined,
    productId: undefined,
    i18nUrlTemplate: undefined,
    onIModelAppInit: undefined,
    additionalI18nNamespaces: undefined,
    extensions: undefined,
    userPreferences: undefined,
    presentationProps: undefined,
  };

export const iTwinViewerInitializerParamList = Object.keys(
  iTwinViewerInitializerParamSample
);

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

/**
 * Defines what items to include from the default status bar. If any items are
 * specified then only those items will be added to statusbar.
 */
export interface ViewerDefaultStatusbarItems {
  messageCenter?: boolean;
  preToolAssistanceSeparator?: boolean;
  toolAssistance?: boolean;
  postToolAssistanceSeparator?: boolean;
  accuSnapModePicker?: boolean;
  tileLoadIndicator?: boolean;
  selectionScope?: boolean;
  selectionInfo?: boolean;
}

export type ViewerDefaultFrontstageConfig = Pick<
  StandardFrontstageProps,
  "hideNavigationAid" | "hideStatusBar" | "hideToolSettings" | "cornerButton"
>;
