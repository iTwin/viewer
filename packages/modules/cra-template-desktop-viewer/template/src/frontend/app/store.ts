/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Valid values for switchState
export enum SwitchState {
  None = 0,
  SelectIModel = 1,
  SelectSnapshot = 2,
  OpenIModel = 3,
  OpenSnapshot = 4,
}

export interface SelectedIModel {
  iModelId: string;
  projectId: string;
}

export interface RootState {
  switchState: SwitchState;
  selectedIModel?: SelectedIModel;
  selectedSnapshot: string;
}

const initialState: RootState = {
  switchState: SwitchState.None,
  selectedSnapshot: "",
};

export const openIModel =
  createAction<SelectedIModel, "OPEN_IMODEL">("OPEN_IMODEL");
export const openSnapshot =
  createAction<string, "OPEN_SNAPSHOT">("OPEN_SNAPSHOT");
export const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(openIModel, (state, action) => {
      return {
        ...state,
        switchState: SwitchState.OpenIModel,
        selectedIModel: action.payload,
      };
    })
    .addCase(openSnapshot, (state, action) => {
      return {
        ...state,
        switchState: SwitchState.OpenSnapshot,
        selectedSnapshot: action.payload,
      };
    });
});

const store = configureStore({
  reducer: appReducer,
});

// typed dispatcher for functional components
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
