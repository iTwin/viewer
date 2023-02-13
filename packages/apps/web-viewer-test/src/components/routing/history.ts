/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { createBrowserHistory } from "@remix-run/router";


// export const history = new History();

export const history = createBrowserHistory({ window });


