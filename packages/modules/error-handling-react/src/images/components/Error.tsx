/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as React from "react";

function SvgError(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        d="M8 0a8 8 0 108 8 8 8 0 00-8-8zm1 12H7v-2h2zm0-3H7V4h2z"
        fill="#c00"
      />
    </svg>
  );
}

export default SvgError;
