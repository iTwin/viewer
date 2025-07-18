/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import type {
  BackstageItem,
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
import type { PresentationProps } from "@itwin/presentation-frontend";
import type { computeSelection, SelectionStorage } from "@itwin/unified-selection";

export type Without<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]?: never };
export type XOR<T1, T2> = T1 | T2 extends Record<string, unknown>
  ? (Without<T1, T2> & T2) | (Without<T2, T1> & T1)
  : T1 | T2;
type AllOrNone<T> = T | { [K in keyof T]?: never };

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
  provider: FrontstageProvider; // eslint-disable-line @typescript-eslint/no-deprecated
  /** should this be the default frontstage? If multiple are defined as default, the last will be used */
  default?: boolean;
  /** the frontstage requires an iModel connection */
  requiresIModelConnection?: boolean;
}

export type ViewerBackstageItem = BackstageItem & {
  labeli18nKey?: string;
};

export interface ViewerViewportControlOptions
  extends Omit<IModelViewportControlOptions, "viewState"> { // eslint-disable-line @typescript-eslint/no-deprecated
  /** ViewState or a function to return a ViewState */
  viewState?:
    | ViewState
    | ((iModelConnection: IModelConnection) => ViewState)
    | ((iModelConnection: IModelConnection) => Promise<ViewState>);
}

export interface UnifiedSelectionProps {
  /** Unified selection storage to synchronize viewport selection with. */
  selectionStorage: SelectionStorage;
}

export function isUnifiedSelectionProps(props: AllOrNone<UnifiedSelectionProps> | undefined): props is UnifiedSelectionProps {
  return typeof props === "object" && "selectionStorage" in props;
}

export interface SelectionScopesProps {
  /** A map of available selection scopes. The key is the scope id and the value is the scope label and definition. */
  available: {
    [scopeId: string]: {
      label: string;
      def: Parameters<typeof computeSelection>[0]["scope"];
    }
  };

  /** Id of the active selection scope. An element with this id must exist in `available` map. */
  active: string;

  /**
   * A callback that's invoked when active scope changes. It's guaranteed that `id` is a key of one of entries
   * in `available` map.
   *
   * When this callback is not supplied, the `active` scope works as the initial value, and the actually
   * active scope is managed internally. When it is supplied, it's consumer's responsibility to update the
   * `active` scope based on the callback's input.
   */
  onChange?: (id: string) => void;
}

export type LoaderProps = AllOrNone<UnifiedSelectionProps> & {
  /** Default UI configuration */
  defaultUiConfig?: ViewerDefaultFrontstageConfig;
  /** Optional callback function when iModel is connected */
  onIModelConnected?:
    | ((iModel: IModelConnection) => void)
    | ((iModel: IModelConnection) => Promise<void>);
  /** additional frontstages to register */
  frontstages?: ViewerFrontstage[];
  /** additional viewport options for the default frontstage's viewport control */
  viewportOptions?: ViewerViewportControlOptions;
  /** [UI Providers](https://www.itwinjs.org/learning/ui/abstract/uiitemsprovider/) to register. Should be memoized. */
  uiProviders?: UiItemsProvider[];
  /** options for creating the default viewState */
  viewCreatorOptions?: ViewerViewCreator3dOptions;
  /** Component to show when loading iModel key */
  loadingComponent?: React.ReactNode;
  /** Props for managing selection scopes. When not supplied, `Presentation.selection.scopes` is used. */
  selectionScopes?: SelectionScopesProps;
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
  presentationProps?: PresentationProps;
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
