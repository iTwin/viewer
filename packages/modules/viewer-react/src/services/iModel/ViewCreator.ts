/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Id64Array, Id64String } from "@bentley/bentleyjs-core";
import { Point3d, Vector3d } from "@bentley/geometry-core";
import {
  BackgroundMapType,
  Code,
  ColorDef,
  IModel,
  RenderMode,
  ViewStateProps,
} from "@bentley/imodeljs-common";
import {
  BlankConnection,
  DisplayStyle3dState,
  IModelApp,
  IModelConnection,
  SpatialViewState,
  StandardViewId,
  ViewState,
} from "@bentley/imodeljs-frontend";

import { BlankConnectionViewState } from "../../types";
import Initializer from "../Initializer";

/** Options for ViewCreator to override certain state */
export interface ViewCreatorOptions {
  /** Override environment display */
  displayEnvironment?: boolean;

  /** Override view rotation with a standard one */
  standardViewRotation?: StandardViewId;
}

/**
 * Class for handling creation of default views in the app
 */
export class ViewCreator {
  /**
   * Merges a seed view in the iModel with the passed view state props. It will be a no-op if there are no default 3D views in the iModel
   * @param iModelConnection IModelConnection to query/load views from
   * @param viewStateProps Input view props to be merged
   */
  private static async mergeSeedView(
    iModelConnection: IModelConnection,
    viewStateProps: ViewStateProps,
    viewDefId: Id64String
  ): Promise<ViewStateProps> {
    // Handle iModels without any default view id
    if (!viewDefId) {
      return viewStateProps;
    }

    const seedViewState = (await iModelConnection.views.load(
      viewDefId
    )) as SpatialViewState;
    const seedViewStateProps = {
      categorySelectorProps: seedViewState.categorySelector.toJSON(),
      modelSelectorProps: seedViewState.modelSelector
        ? seedViewState.modelSelector.toJSON()
        : undefined,
      viewDefinitionProps: seedViewState.toJSON(),
      displayStyleProps: seedViewState.displayStyle.toJSON(),
    };

    const mergedDisplayProps = seedViewStateProps.displayStyleProps;
    if (viewStateProps?.displayStyleProps?.jsonProperties) {
      mergedDisplayProps.jsonProperties.styles = {
        ...mergedDisplayProps.jsonProperties.styles,
        ...viewStateProps.displayStyleProps.jsonProperties.styles,
      };
    }

    const mergedViewProps = seedViewStateProps.viewDefinitionProps;
    if (!mergedViewProps.jsonProperties) {
      mergedViewProps.jsonProperties = {};
    }
    if (viewStateProps.viewDefinitionProps.jsonProperties) {
      mergedViewProps.jsonProperties.viewDetails = {
        ...mergedViewProps.jsonProperties.viewDetails,
        ...viewStateProps.viewDefinitionProps.jsonProperties.viewDetails,
      };
    }

    return {
      ...seedViewStateProps,
      ...mergedViewProps,
      categorySelectorProps: viewStateProps.categorySelectorProps,
      modelSelectorProps: viewStateProps.modelSelectorProps,
      displayStyleProps: mergedDisplayProps,
    };
  }

  /**
   * Generates a view state props object for creating a view. Merges display styles with a seed view if the NavigatorApp.flags.useSeedView is ON
   * @param iModelConnection IModelConnection to use
   * @param categories Categories to put in view props
   * @param models Models to put in view props
   */
  private static async _manufactureViewStateProps(
    iModelConnection: IModelConnection,
    categories: Id64String[],
    models: Id64String[],
    viewDefId?: Id64String
  ): Promise<ViewStateProps> {
    // Use dictionary model in all props
    const dictionaryId = IModel.dictionaryId;

    // Category Selector Props
    const categorySelectorProps = {
      categories,
      code: Code.createEmpty(),
      model: dictionaryId,
      classFullName: "BisCore:CategorySelector",
    };
    // Model Selector Props
    const modelSelectorProps = {
      models,
      code: Code.createEmpty(),
      model: dictionaryId,
      classFullName: "BisCore:ModelSelector",
    };
    // View Definition Props
    const viewDefinitionProps = {
      categorySelectorId: "",
      displayStyleId: "",
      code: Code.createEmpty(),
      model: dictionaryId,
      classFullName: "BisCore:SpatialViewDefinition",
    };
    // Display Style Props
    const displayStyleProps = {
      code: Code.createEmpty(),
      model: dictionaryId,
      classFullName: "BisCore:DisplayStyle",
      jsonProperties: {
        styles: {
          viewflags: {
            renderMode: RenderMode.SmoothShade,
            noSourceLights: false,
            noCameraLights: false,
            noSolarLight: false,
            noConstruct: true,
            noTransp: false,
            visEdges: true,
            grid: false,
            backgroundMap: iModelConnection.isGeoLocated,
          },
        },
      },
    };

    const viewStateProps = {
      displayStyleProps,
      categorySelectorProps,
      modelSelectorProps,
      viewDefinitionProps,
    };
    return viewDefId !== undefined
      ? ViewCreator.mergeSeedView(iModelConnection, viewStateProps, viewDefId)
      : viewStateProps;
  }

  /**
   * Get all categories containing elements
   * @param iModelConnection IModelConnection to query
   */
  public static async getAllCategories(
    iModelConnection: IModelConnection
  ): Promise<Id64Array> {
    const categories: Id64Array = [];

    // Only use categories with elements in them
    const selectUsedSpatialCategoryIds =
      "SELECT DISTINCT Category.Id as id from BisCore.GeometricElement3d WHERE Category.Id IN (SELECT ECInstanceId from BisCore.SpatialCategory)";
    for await (const row of iModelConnection.query(
      selectUsedSpatialCategoryIds
    )) {
      categories.push(row.id);
    }

    return categories;
  }

  /**
   * Get all PhysicalModel ids in the connection
   * @param iModelConnection IModelConnection to query
   */
  private static async _getAllModels(
    iModelConnection: IModelConnection
  ): Promise<Id64Array> {
    // SBUG: was BisCore.PhysicalModel but that include our Alignment model. For now switched to
    // include the spatial models so I can see that geometry, but ultimately physical model might be correct.
    // AGeo: Was BisCore.SpatialModel but we were unable to display models converted using the Civil iModel02 bridge.
    const geometricModel3d =
      "SELECT p.ECInstanceId id, p.Parent.Id subjectId FROM bis.InformationPartitionElement p JOIN bis.Model m ON m.ModeledElement.Id = p.ECInstanceId WHERE NOT m.IsPrivate";

    const models: Id64Array = [];
    for await (const row of iModelConnection.query(geometricModel3d)) {
      models.push(row.id);
    }

    return models;
  }

  /**
   * Creates a default view based on the given model ids. Uses all models ON if no modelIds passed
   * @param iModelConnection IModelConnection to query for categories and/or models
   * @param modelIds [optional] Model Ids to use in the view
   */
  public static async createDefaultView(
    iModelConnection: IModelConnection,
    modelIds?: Id64String[],
    viewDefId?: Id64String,
    options?: ViewCreatorOptions
  ): Promise<ViewState | undefined> {
    try {
      const categories: Id64Array = await ViewCreator.getAllCategories(
        iModelConnection
      );
      const models = modelIds
        ? modelIds
        : await ViewCreator._getAllModels(iModelConnection);
      if (!models) {
        return undefined;
      }

      const props = await ViewCreator._manufactureViewStateProps(
        iModelConnection,
        categories,
        models,
        viewDefId
      );
      const viewState = SpatialViewState.createFromProps(
        props,
        iModelConnection
      );
      if (!viewState) {
        return undefined;
      }

      await viewState.load();

      this._applyOptions(viewState, options);

      if (iModelConnection.isGeoLocated) {
        viewState.viewFlags.backgroundMap = true;
        if (
          (viewState.getDisplayStyle3d().settings.backgroundMap
            .providerName as string) !== "BingProvider"
        ) {
          viewState.getDisplayStyle3d().changeBackgroundMapProps({
            providerName: "BingProvider",
            providerData: { mapType: BackgroundMapType.Hybrid },
          });
        }
      }
      return viewState;
    } catch (error) {
      console.log(`Error obtaining default viewState: ${error}`);
      const viewStateError = IModelApp.i18n.translateWithNamespace(
        "iTwinViewer",
        "iModels.viewStateError"
      );
      if (iModelConnection.contextId && iModelConnection.iModelId) {
        const msg = await Initializer.getIModelDataErrorMessage(
          iModelConnection.contextId,
          iModelConnection.iModelId,
          viewStateError
        );
        throw msg;
      } else {
        throw viewStateError;
      }
    }
  }

  /**
   * Generate a default viewState for a blank connection
   * @param iModel
   * @param viewStateOptions
   */
  public static createBlankViewState = (
    iModel: BlankConnection,
    viewStateOptions?: BlankConnectionViewState
  ): SpatialViewState => {
    const ext = iModel.projectExtents;
    const viewState = SpatialViewState.createBlank(
      iModel,
      ext.low,
      ext.high.minus(ext.low)
    );

    const allow3dManipulations =
      viewStateOptions?.setAllow3dManipulations !== undefined
        ? viewStateOptions?.setAllow3dManipulations
        : true;

    viewState.setAllow3dManipulations(allow3dManipulations);

    const viewStateLookAt = viewStateOptions?.lookAt || {
      eyePoint: new Point3d(15, 15, 15),
      targetPoint: new Point3d(0, 0, 0),
      upVector: new Vector3d(0, 0, 1),
    };

    viewState.lookAt(
      viewStateLookAt.eyePoint,
      viewStateLookAt.targetPoint,
      viewStateLookAt.upVector,
      viewStateLookAt.newExtents,
      viewStateLookAt.frontDistance,
      viewStateLookAt.backDistance,
      viewStateLookAt.opts
    );

    viewState.displayStyle.backgroundColor =
      viewStateOptions?.displayStyle?.backgroundColor ?? ColorDef.white;
    const flags = viewState.viewFlags.clone();
    flags.grid = viewStateOptions?.viewFlags?.grid ?? false;
    flags.renderMode =
      viewStateOptions?.viewFlags?.renderMode ?? RenderMode.SmoothShade;
    viewState.displayStyle.viewFlags = flags;
    return viewState;
  };

  private static _applyOptions(
    viewState: SpatialViewState,
    options?: ViewCreatorOptions
  ) {
    if (options !== undefined) {
      if (options.displayEnvironment !== undefined) {
        const displayStyle = viewState.displayStyle as DisplayStyle3dState;
        if (displayStyle) {
          displayStyle.environment.ground.display = options.displayEnvironment;
          displayStyle.environment.sky.display = options.displayEnvironment;
        }
      }

      if (options.standardViewRotation !== undefined) {
        viewState.setStandardRotation(options.standardViewRotation);
      }
    }
  }
}
