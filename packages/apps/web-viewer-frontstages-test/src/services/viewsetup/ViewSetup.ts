/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { Id64Array, Id64Set, Id64String } from "@itwin/core-bentley";
import { Id64 } from "@itwin/core-bentley";
import {
  ColorDef,
  Environment,
  PlanarClipMaskMode,
  PlanarClipMaskSettings,
} from "@itwin/core-common";
import type { IModelConnection, ViewState } from "@itwin/core-frontend";
import {
  DrawingViewState,
  IModelApp,
  SpatialViewState,
} from "@itwin/core-frontend";
import { Matrix3d } from "@itwin/core-geometry";

import { AuthorizationClient } from "../auth/AuthorizationClient";

const metroStationImodelName = "DRWR04-S3";
export class ViewSetup {
  /** Queries for and loads the default view for an iModel. */
  public static getDefaultView = async (
    imodel: IModelConnection
  ): Promise<ViewState> => {
    const viewId = await ViewSetup.getFirstViewDefinitionId(imodel);

    // Load the view state using the viewSpec's ID
    const viewState = await imodel.views.load(viewId);

    // Making some improvements to the default views.
    await ViewSetup.overrideView(imodel, viewState);

    return viewState;
  };

  /** Pick the first available spatial view definition in the imodel */
  private static async getFirstViewDefinitionId(
    imodel: IModelConnection
  ): Promise<Id64String> {
    // Return default view definition (if any)
    const defaultViewId = await imodel.views.queryDefaultViewId();
    if (Id64.isValid(defaultViewId)) {
      return defaultViewId;
    }

    // Return first spatial view definition (if any)
    const spatialViews: IModelConnection.ViewSpec[] =
      await imodel.views.getViewList({ from: SpatialViewState.classFullName });
    if (spatialViews.length > 0) {
      return spatialViews[0].id;
    }

    // Return first drawing view definition (if any)
    const drawingViews: IModelConnection.ViewSpec[] =
      await imodel.views.getViewList({ from: DrawingViewState.classFullName });
    if (drawingViews.length > 0) {
      return drawingViews[0].id;
    }

    throw new Error("No valid view definitions in imodel");
  }

  /** Returns the aspect ration of the container the view will be created in. */
  public static getAspectRatio(): number | undefined {
    const viewDiv = document.getElementById("sample-container");

    if (null === viewDiv) {
      return undefined;
    }

    return viewDiv.clientWidth / viewDiv.clientHeight;
  }

  /** Makes ascetic changes to the default view */
  public static async overrideView(
    imodel: IModelConnection,
    viewState: ViewState
  ) {
    const aspect = ViewSetup.getAspectRatio();
    if (undefined !== aspect) {
      viewState.adjustAspectRatio(aspect);
    }

    viewState.viewFlags = viewState.viewFlags.copy({
      shadows: false,
      grid: false,
      visibleEdges: false,
    });

    if (viewState.is3d()) {
      const viewState3d = viewState;
      const displayStyle = viewState3d.getDisplayStyle3d();

      displayStyle.changeBackgroundMapProps({ useDepthBuffer: true });
      const groundBias: number | undefined = await ViewSetup.getGroundBias(
        imodel
      );
      if (groundBias) {
        displayStyle.changeBackgroundMapProps({ groundBias });
      }

      // Enable the sky-box, but override to old sky box.
      displayStyle.environment = Environment.fromJSON({
        sky: {
          display: true,
          twoColor: true,
          zenithColor: ColorDef.computeTbgrFromString("#DEF2FF"),
          nadirColor: ColorDef.computeTbgrFromString("#F0ECE8"),
        },
      });

      // Enable model masking on the metrostation model.
      if (
        imodel.name === "Metrostation2" ||
        imodel.name === metroStationImodelName
      ) {
        const modelIds = await ViewSetup.getModelIds(imodel);
        const subCategoryIds = await this.getSubCategoryIds(
          imodel,
          "S-SLAB-CONC"
        );
        let planarClipMaskSettings = PlanarClipMaskSettings.create({
          subCategoryIds,
          modelIds,
        });
        planarClipMaskSettings = planarClipMaskSettings.clone({
          mode: PlanarClipMaskMode.IncludeSubCategories,
        });
        displayStyle.changeBackgroundMapProps({
          planarClipMask: planarClipMaskSettings.toJSON(),
        });
      }
    }

    if (viewState.isSpatialView()) {
      const displayStyle = viewState.getDisplayStyle3d();
      // Enable model masking on the Stadium model.
      if (imodel.name === "Stadium") {
        const modelsForMasking = await ViewSetup.getModelIds(
          imodel,
          "SS_MasterLandscape.dgn, LandscapeModel"
        );
        displayStyle.changeBackgroundMapProps({
          planarClipMask: PlanarClipMaskSettings.create({
            modelIds: modelsForMasking,
          }).toJSON(),
          transparency: 0.01, // Temporary fix due to how the planar clip and transparency interact.
        });
        const excludedModelIds = await ViewSetup.getModelIds(
          imodel,
          "SS_Master",
          "SS_Master_Structural.dgn, 3D Metric Design",
          "LandscapeDetails.dgn, 3D Metric Design",
          "Stencil Model-4-LandscapeModel, SS_MasterLandscape, SS_MasterLandscape.dgn, Road_Marking"
        );
        excludedModelIds.forEach((id) =>
          viewState.modelSelector.dropModels(id)
        );
      }

      // Enable most models on DRWR04-S3 model
      if (imodel.name === metroStationImodelName) {
        const modelIds = await ViewSetup.getModelIds(imodel);
        modelIds.forEach((id) => viewState.modelSelector.addModels(id));

        const modelsForDropping = await ViewSetup.getModelIds(
          imodel,
          "Geotechnical Investigation, DRWR04-GEO-00-XX-M3-G-00001.dgn, 3d"
        );
        modelsForDropping.forEach((id) =>
          viewState.modelSelector.dropModels(id)
        );

        // Change camera
        viewState.setOrigin({
          x: 85.69962649857428,
          y: -73.80364503759616,
          z: -82.72194576398469,
        });
        viewState.setExtents({
          x: 144.70409923774804,
          y: 150.2952419865793,
          z: 151.43496224165358,
        });
        viewState.setRotation(
          Matrix3d.fromJSON([
            -0.8568887533689478, 0.5155013718214635, -1.178475644302565e-15,
            -0.18679591952287192, -0.31050028450708866, 0.9320390859672258,
            0.48046742740732745, 0.7986538104655898, 0.36235775447667495,
          ])
        );
      }
    }

    const shownCategories = await ViewSetup.getShownCategories(imodel);
    if (shownCategories) {
      viewState.categorySelector.addCategories(shownCategories);
    }

    const hiddenCategories = await ViewSetup.getHiddenCategories(imodel);
    if (hiddenCategories) {
      viewState.categorySelector.dropCategories(hiddenCategories);
    }
  }

  /** Returns a set of every model's id in the iModel. */
  public static async getModelIds(
    iModel: IModelConnection,
    ...modelNames: string[]
  ): Promise<Id64Set> {
    const ids = new Set<string>();
    if (!iModel.isClosed) {
      const query = `SELECT ECInstanceId FROM Bis:PhysicalPartition${
        modelNames.length > 0
          ? ` WHERE codeValue IN ('${modelNames.join("','")}')`
          : ""
      }`;
      for await (const row of iModel.query(query)) {
        ids.add(row[0]);
      }
    }
    return ids;
  }

  /** Returns a set of every sub category in the specified category codes. */
  public static async getSubCategoryIds(
    iModel: IModelConnection,
    ...categoryCodes: string[]
  ): Promise<Id64Set> {
    const subcategoriesIds = new Set<string>();
    if (!iModel.isClosed) {
      const selectSubCategories = `SELECT ECInstanceId as id 
                                    FROM BisCore.SubCategory 
                                    WHERE Parent.Id IN (
                                      SELECT ECInstanceId 
                                      FROM BisCore.SpatialCategory 
                                      ${
                                        categoryCodes.length > 0
                                          ? `WHERE CodeValue IN ('${categoryCodes.join(
                                              "','"
                                            )}')`
                                          : ""
                                      })`;

      for await (const row of iModel.query(selectSubCategories)) {
        subcategoriesIds.add(row[0]);
      }
    }
    return subcategoriesIds;
  }

  /** Queries for categories that are unnecessary in the context of the of the sample showcase. */
  private static getHiddenCategories = async (
    imodel: IModelConnection
  ): Promise<Id64Array | undefined> => {
    const ids: Id64String[] = [];
    const addIdsByCategory = async (...categoryCodes: string[]) => {
      if (!imodel.isClosed) {
        const selectInCategories = `SELECT ECInstanceId FROM bis.Category WHERE CodeValue IN ('${categoryCodes.join(
          "','"
        )}')`;
        for await (const row of imodel.query(selectInCategories)) {
          ids.push(row.id);
        }
      }
    };
    if (imodel.name === "house bim upload") {
      // The callout graphics in the house model are ugly - don't display them.
      await addIdsByCategory("Callouts");
    }

    if (
      imodel.name === "Metrostation2" ||
      imodel.name === metroStationImodelName
    ) {
      // There is coincident geometry. Remove the more visible instances.
      await addIdsByCategory(
        "A-FLOR-OTLN",
        "A-Reserved Retail Area",
        "G-ANNO-SYMB",
        "A-SITE",
        "S-BEAM-CONC"
      );
    }

    return ids;
  };

  private static getShownCategories = async (
    imodel: IModelConnection
  ): Promise<Id64Array | undefined> => {
    const ids: Id64String[] = [];
    const addIdsByCategory = async () => {
      if (!imodel.isClosed) {
        const selectInCategories = `SELECT ECInstanceId FROM bis.Category`;
        for await (const row of imodel.query(selectInCategories)) {
          ids.push(row.id);
        }
      }
    };
    if (imodel.name === metroStationImodelName) {
      await addIdsByCategory();
    }

    return ids;
  };

  /*
   * groundBias can be stored in Product Settings Service. This method retrieves it.
   */
  public static getGroundBias = async (
    imodel: IModelConnection
  ): Promise<number | undefined> => {
    if (imodel.name === metroStationImodelName) {
      return 3;
    }

    if (IModelApp.userPreferences) {
      const groundBiasSetting = await IModelApp.userPreferences.get({
        accessToken: await AuthorizationClient.oidcClient.getAccessToken(),
        namespace: "bingMapSettings",
        key: "backgroundMapSetting",
        iTwinId: imodel.iTwinId!,
        iModelId: imodel.iModelId,
      });

      if (groundBiasSetting) {
        return groundBiasSetting;
      }
    }

    return undefined;
  };
}
