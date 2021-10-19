/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as React from "react";

function SvgSuccessHollow(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path
        d="M8 1.5A6.5 6.5 0 111.5 8 6.507 6.507 0 018 1.5M8 0a8 8 0 108 8 8.024 8.024 0 00-8-8z"
        fill="#56aa1c"
      />
      <path
        d="M6.651 11.994L3 8.594l1.396-1.3 2.362 2.2 4.833-4.5 1.396 1.3z"
        fill="#56aa1c"
      />
    </svg>
  );
}

export default SvgSuccessHollow;
