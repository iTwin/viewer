/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export type EventTrackerFunction<T = string> = (
  name: T,
  properties?: { [key: string]: any }
) => void;
