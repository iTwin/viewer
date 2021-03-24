/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as React from "react";

function SvgErrorHollow(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path
        d="M8 1.5A6.5 6.5 0 111.5 8 6.507 6.507 0 018 1.5M8 0a8 8 0 108 8 8 8 0 00-8-8z"
        fill="#c00"
      />
      <path d="M9 12H7v-2h2zm0-3H7V4h2z" fill="#c00" fillRule="evenodd" />
    </svg>
  );
}

export default SvgErrorHollow;
