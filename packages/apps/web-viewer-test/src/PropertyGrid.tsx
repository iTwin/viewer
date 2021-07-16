/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import "./PropertyGrid.scss";

import * as React from "react";

import {
    AuthorizedFrontendRequestContext,
    IModelApp,
    IModelConnection,
} from "@bentley/imodeljs-frontend";
import { Field } from "@bentley/presentation-common";
import {
    IPresentationPropertyDataProvider,
    PresentationPropertyDataProvider,
} from "@bentley/presentation-components";
import { Presentation } from "@bentley/presentation-frontend";
import { SettingsStatus } from "@bentley/product-settings-client";
import { PropertyRecord } from "@bentley/ui-abstract";
import {
    ActionButtonRenderer,
    ActionButtonRendererProps,
    PropertyData,
    PropertyDataFiltererBase,
    PropertyGridContextMenuArgs,
    PropertyValueRendererManager,
    VirtualizedPropertyGridWithDataProvider,
} from "@bentley/ui-components";
import {
    ContextMenuItem,
    ContextMenuItemProps,
    GlobalContextMenu,
    Icon,
    Orientation,
} from "@bentley/ui-core";
import { ConfigurableCreateInfo, WidgetControl } from "@bentley/ui-framework";

import { PropertyDataProvider } from "@bentley/property-grid-react/lib/api/PropertyGridDataProvider";
import { copyToClipboard } from "@bentley/property-grid-react/lib/api/WebUtilities";
import { PropertyGridManager } from "@bentley/property-grid-react";
import {
    FilteringPropertyGridWithUnifiedSelection,
    NonEmptyValuesPropertyDataFilterer,
    PlaceholderPropertyDataFilterer,
} from "@bentley/property-grid-react/lib/components/FilteringPropertyGrid";
import { useEffect, useState } from "react";

const sharedNamespace = "favoriteProperties";
const sharedName = "sharedProps";
type ContextMenuItemInfo = ContextMenuItemProps &
    React.Attributes & { label: string };

export interface PropertyGridFeatureTracking {
    trackCopyPropertyText: () => void;
}

export interface OnSelectEventArgs {
    dataProvider: IPresentationPropertyDataProvider;
    field?: Field;
    contextMenuArgs: PropertyGridContextMenuArgs;
}

export interface PropertyGridProps {
    iModelConnection: IModelConnection;
    projectId: string;
    orientation?: Orientation;
    isOrientationFixed?: boolean;
    enableFavoriteProperties?: boolean;
    enableCopyingPropertyText?: boolean;
    enableNullValueToggle?: boolean;
    additionalContextMenuOptions?: ContextMenuItemInfo[];
    debugLog?: (message: string) => void;
    featureTracking?: PropertyGridFeatureTracking;
    rulesetId?: string;
    rootClassName?: string;
    dataProvider?: PresentationPropertyDataProvider;
    onInfoButton?: () => void;
    onBackButton?: () => void;
    disableUnifiedSelection?: boolean;
}

interface PropertyGridState {
    title?: PropertyRecord;
    className: string;
    contextMenu?: PropertyGridContextMenuArgs;
    contextMenuItemInfos?: ContextMenuItemInfo[];
    sharedFavorites: string[];
    showNullValues?: boolean;
}

export const PropertyGrid = (props: PropertyGridProps) => {

    const [title, setTitle] = useState<PropertyRecord>();
    const [className, setClassName] = useState<string>("");
    const [contextMenu, setContextMenu] = useState<PropertyGridContextMenuArgs>();
    const [contextMenuItemInfos, setContextMenuItemInfos] = useState<ContextMenuItemInfo[]>();
    const [sharedFavorites, setSharedFavorites] = useState<string[]>([]);
    const [showNullValues, setShowNullValues] = useState<boolean>(true);

    var dataProvider: PresentationPropertyDataProvider = props.dataProvider ?? new PropertyDataProvider(
        props.iModelConnection,
        props.rulesetId,
        props.enableFavoriteProperties,
    )

    if (PropertyGridManager.flags.enablePropertyGroupNesting) {
        dataProvider.isNestedPropertyCategoryGroupingEnabled = true;
    }

    var filterer: PropertyDataFiltererBase = new PlaceholderPropertyDataFilterer();

    useEffect(() => {
        const mount = async () => {
            let currentData = await dataProvider.getData();
            currentData = await addSharedFavsToData(currentData);

            if (currentData) {
                setTitle(currentData.label);
                setClassName(currentData.description ?? "");
            }

        }
        mount();
    }, []);

    useEffect(() => {
        dataProvider = new PropertyDataProvider(
            props.iModelConnection,
            props.rulesetId,
            props.enableFavoriteProperties,
        )
    }, [props]);

    const addSharedFavsToData = async (propertyData: PropertyData) => {
        let newSharedFavs: string[] = [];
        if (props.projectId) {
            const requestContext = await AuthorizedFrontendRequestContext.create();
            const result = await IModelApp.settings.getSharedSetting(
                requestContext,
                sharedNamespace,
                sharedName,
                false,
                props.projectId,
                props.iModelConnection.iModelId,
            );
            if (result.setting?.slice) {
                newSharedFavs = (result.setting as string[]).slice();
            }
            setSharedFavorites(newSharedFavs);
        }
        if (propertyData.categories[0]?.name !== "Favorite") {
            propertyData.categories.unshift({
                name: "Favorite",
                label: "Favorite",
                expand: true,
            });
            propertyData.records.Favorite = [];
        }
        const favoritesCategoryName = await getFavoritesCategoryName(
            propertyData.records,
        );
        const dataFavs = propertyData.records[favoritesCategoryName];

        for (const cat of propertyData.categories) {
            if (cat.name !== "Favorite") {
                for (const rec of propertyData.records[cat.name]) {
                    const propName = rec.property.name;
                    const shared =
                        newSharedFavs &&
                        newSharedFavs?.findIndex(
                            (fav: string) => rec.property.name === fav,
                        ) >= 0;
                    if (
                        shared &&
                        !dataFavs.find(
                            (favRec: PropertyRecord) => favRec.property.name === propName,
                        )
                    ) {
                        // if shared & not already in favorites
                        dataFavs.push(rec);
                        const propertyField = await dataProvider?.getFieldByPropertyRecord(
                            rec,
                        );
                        if (propertyField) {
                            await Presentation.favoriteProperties.add(
                                propertyField,
                                props.projectId,
                            );
                        }
                    }
                }
            }
        }
        return dataProvider.getData();
    }

    /**
     * Finds the name of the Favorites category
     * @param propertyRecords
     */
    const getFavoritesCategoryName = async (categories: {
        [categoryName: string]: PropertyRecord[];
    }) => {
        const keys = Object.keys(categories);

        for (const key of keys) {
            const category = categories[key];
            for (const record of category) {
                const field = await dataProvider.getFieldByPropertyRecord(record);
                if (
                    field !== undefined &&
                    Presentation.favoriteProperties.has(
                        field,
                        props.projectId,
                        props.iModelConnection.iModelId,
                    )
                ) {
                    return key;
                }
            }
        }
        return "Favorite";
    }

    useEffect(() => {
        const asyncFunction = async () => {
            let propertyData: PropertyData = await dataProvider.getData();
            propertyData = await addSharedFavsToData(propertyData);
            setTitle(propertyData.label);
            setClassName(propertyData.description ?? "")
        }
        asyncFunction();
    }, [dataProvider.onDataChanged]);

    const onAddFavorite = async (propertyField: Field) => {
        Presentation.favoriteProperties.add(propertyField, props.projectId);
        setContextMenu(undefined);
    }

    const onRemoveFavorite = async (propertyField: Field) => {
        Presentation.favoriteProperties.remove(propertyField, props.projectId);
        setContextMenu(undefined);
    }

    const onShareFavorite = async (propName: string) => {
        if (!props.projectId || !sharedFavorites) {
            setContextMenu(undefined);
            return;
        }
        sharedFavorites.push(propName);

        const requestContext = await AuthorizedFrontendRequestContext.create();
        const result = await IModelApp.settings.saveSharedSetting(
            requestContext,
            sharedFavorites,
            sharedNamespace,
            sharedName,
            false,
            props.projectId,
            props.iModelConnection.iModelId,
        );
        if (result.status !== SettingsStatus.Success) {
            throw new Error(
                "Could not share favoriteProperties: " + result.errorMessage,
            );
        }
        const result2 = await IModelApp.settings.getSharedSetting(
            requestContext,
            sharedNamespace,
            sharedName,
            false,
            props.projectId,
            props.iModelConnection.iModelId,
        );
        if (result2.status !== SettingsStatus.Success) {
            throw new Error(
                "Could not share favoriteProperties: " + result2.errorMessage,
            );
        }
        setContextMenu(undefined);
    }

    const onUnshareFavorite = async (propName: string) => {
        if (!props.projectId || !sharedFavorites) {
            setContextMenu(undefined);
            return;
        }
        const index = sharedFavorites.indexOf(propName);
        if (index > -1) {
            sharedFavorites.splice(index, 1);
        }
        const requestContext = await AuthorizedFrontendRequestContext.create();
        const result = await IModelApp.settings.saveSharedSetting(
            requestContext,
            sharedFavorites,
            sharedNamespace,
            sharedName,
            false,
            props.projectId,
            props.iModelConnection.iModelId,
        );
        if (result.status !== SettingsStatus.Success) {
            throw new Error(
                "Could not unshare favoriteProperties: " + result.errorMessage,
            );
        }
        setContextMenu(undefined);
    }

    const shareActionButtonRenderer: ActionButtonRenderer = (
        props: ActionButtonRendererProps) => {
        const shared =
            sharedFavorites !== undefined &&
            sharedFavorites?.findIndex(
                (fav: string) => props.property.property.name === fav,
            ) >= 0;
        return (
            <div>
                {shared && (
                    <span
                        className="icon icon-share"
                        style={{ paddingRight: "5px" }}
                    ></span>
                )}
            </div>
        );
    }

    const onCopyText = async (property: PropertyRecord) => {
        if (property.description) copyToClipboard(property.description);
        else if (props.debugLog)
            props.debugLog(
                "PROPERTIES COPY TEXT FAILED TO RUN DUE TO UNDEFINED PROPERTY RECORD DESCRIPTION",
            );
        setContextMenu(undefined);
    }

    const onHideNull = () => {
        filterer = new NonEmptyValuesPropertyDataFilterer();
        setContextMenu(undefined);
        setShowNullValues(false);
    }

    const onShowNull = () => {
        filterer = new PlaceholderPropertyDataFilterer();
        setContextMenu(undefined);
        setShowNullValues(true);
    }

    const onPropertyContextMenu = (args: PropertyGridContextMenuArgs) => {
        args.event.persist();
        setContextMenu(args.propertyRecord.isMerged ? undefined : args)
        buildContextMenu(args);
    }

    const onContextMenuOutsideClick = () => {
        setContextMenu(undefined);
    }

    const onContextMenuEsc = () => {
        setContextMenu(undefined);
    }

    const buildContextMenu = async (args: PropertyGridContextMenuArgs) => {
        const field = await dataProvider.getFieldByPropertyRecord(
            args.propertyRecord,
        );
        const items: ContextMenuItemInfo[] = [];
        if (field !== undefined && props.enableFavoriteProperties) {
            if (
                sharedFavorites &&
                sharedFavorites?.findIndex(
                    (fav: string) => args.propertyRecord.property.name === fav,
                ) >= 0
            ) {
                // i.e. if shared
                items.push({
                    key: "unshare-favorite",
                    onSelect: () =>
                        onUnshareFavorite(args.propertyRecord.property.name),
                    title: PropertyGridManager.translate(
                        "context-menu.unshare-favorite.description",
                    ),
                    label: PropertyGridManager.translate(
                        "context-menu.unshare-favorite.label",
                    ),
                });
            } else if (
                Presentation.favoriteProperties.has(field, props.projectId)
            ) {
                items.push({
                    key: "share-favorite",
                    onSelect: () =>
                        onShareFavorite(args.propertyRecord.property.name),
                    title: PropertyGridManager.translate(
                        "context-menu.share-favorite.description",
                    ),
                    label: PropertyGridManager.translate(
                        "context-menu.share-favorite.label",
                    ),
                });
                items.push({
                    key: "remove-favorite",
                    onSelect: () => onRemoveFavorite(field),
                    title: PropertyGridManager.translate(
                        "context-menu.remove-favorite.description",
                    ),
                    label: PropertyGridManager.translate(
                        "context-menu.remove-favorite.label",
                    ),
                });
            } else {
                items.push({
                    key: "add-favorite",
                    onSelect: () => onAddFavorite(field),
                    title: PropertyGridManager.translate(
                        "context-menu.add-favorite.description",
                    ),
                    label: PropertyGridManager.translate(
                        "context-menu.add-favorite.label",
                    ),
                });
            }
        }

        if (props.enableCopyingPropertyText) {
            items.push({
                key: "copy-text",
                onSelect: async () => {
                    if (props.featureTracking)
                        props.featureTracking.trackCopyPropertyText();
                    await onCopyText(args.propertyRecord);
                },
                title: PropertyGridManager.translate(
                    "context-menu.copy-text.description",
                ),
                label: PropertyGridManager.translate("context-menu.copy-text.label"),
            });
        }

        if (props.enableNullValueToggle) {
            if (showNullValues) {
                items.push({
                    key: "hide-null",
                    onSelect: () => {
                        onHideNull();
                    },
                    title: PropertyGridManager.translate(
                        "context-menu.hide-null.description",
                    ),
                    label: PropertyGridManager.translate(
                        "context-menu.hide-null.label",
                    ),
                });
            } else {
                items.push({
                    key: "show-null",
                    onSelect: () => {
                        onShowNull();
                    },
                    title: PropertyGridManager.translate(
                        "context-menu.show-null.description",
                    ),
                    label: PropertyGridManager.translate(
                        "context-menu.show-null.label",
                    ),
                });
            }
        }

        if (
            props.additionalContextMenuOptions &&
            props.additionalContextMenuOptions.length > 0
        ) {
            for (const option of props.additionalContextMenuOptions) {
                items.push({
                    ...option,
                    onSelect: () => {
                        if (option.onSelect) {
                            (option.onSelect as (args: OnSelectEventArgs) => void)({
                                contextMenuArgs: args,
                                field,
                                dataProvider: dataProvider,
                            });
                        }

                        setContextMenu(undefined);
                    },
                });
            }
        }

        setContextMenuItemInfos(items.length > 0 ? items : undefined);
    }

    const renderContextMenu = () => {
        if (!contextMenu || !contextMenuItemInfos)
            return undefined;

        const items: React.ReactNode[] = [];
        contextMenuItemInfos.forEach((info: ContextMenuItemInfo) =>
            items.push(
                <ContextMenuItem
                    key={info.key}
                    onSelect={info.onSelect}
                    title={info.title}
                >
                    {info.label}
                </ContextMenuItem>,
            ),
        );

        return (
            <GlobalContextMenu
                opened={true}
                onOutsideClick={onContextMenuOutsideClick}
                onEsc={onContextMenuEsc}
                identifier="PropertiesWidget"
                x={contextMenu!.event.clientX}
                y={contextMenu!.event.clientY}
            >
                {items}
            </GlobalContextMenu>
        );
    }

    const renderHeader = () => {
        return (
            <div className="property-grid-react-panel-header">
                {props.onBackButton !== undefined && (
                    <div
                        className="property-grid-react-panel-back-btn"
                        onClick={props.onBackButton}
                    >
                        <Icon
                            className="property-grid-react-panel-icon"
                            iconSpec="icon-progress-backward"
                        />
                    </div>
                )}
                <div className="property-grid-react-panel-label-and-class">
                    <div className="property-grid-react-panel-label">
                        {title &&
                            PropertyValueRendererManager.defaultManager.render(
                                title,
                            )}
                    </div>
                    <div className="property-grid-react-panel-class">
                        {className}
                    </div>
                </div>
                {props.onInfoButton !== undefined && (
                    <div
                        className="property-grid-react-panel-info-btn"
                        onClick={props.onInfoButton}
                    >
                        <Icon
                            className="property-grid-react-panel-icon"
                            iconSpec="icon-info-hollow"
                        />
                    </div>
                )}
            </div>
        );
    }

    const renderPropertyGrid = () => {
        if (props.disableUnifiedSelection) {
            return (
                <VirtualizedPropertyGridWithDataProvider
                    orientation={props.orientation ?? Orientation.Horizontal}
                    isOrientationFixed={props.isOrientationFixed ?? true}
                    dataProvider={dataProvider}
                    isPropertyHoverEnabled={true}
                    isPropertySelectionEnabled={true}
                    onPropertyContextMenu={onPropertyContextMenu}
                    actionButtonRenderers={[shareActionButtonRenderer]}
                />
            );
        } else {
            return (
                <div className="filtering-property-grid-with-unified-selection">
                    <FilteringPropertyGridWithUnifiedSelection
                        orientation={props.orientation ?? Orientation.Horizontal}
                        isOrientationFixed={props.isOrientationFixed ?? true}
                        dataProvider={dataProvider}
                        filterer={filterer}
                        isPropertyHoverEnabled={true}
                        isPropertySelectionEnabled={true}
                        onPropertyContextMenu={onPropertyContextMenu}
                        actionButtonRenderers={[shareActionButtonRenderer]}
                    />
                </div>
            );
        }
    }

    return (
        <div className={props.rootClassName}>
          {renderHeader()}
          {renderPropertyGrid()}
          {renderContextMenu()}
        </div>
      );

}