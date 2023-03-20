/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as React from "react";

function SvgInfoHollow(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path
        d="M8 1.5A6.5 6.5 0 111.5 8 6.507 6.507 0 018 1.5M8 0a8 8 0 108 8 8.024 8.024 0 00-8-8zm1.2 3.2a.923.923 0 011 .9 1.31 1.31 0 01-1.3 1.2.945.945 0 01-1-1 1.228 1.228 0 011.3-1.1zm-2 9.6c-.5 0-.9-.3-.5-1.7l.6-2.4c.1-.4.1-.5 0-.5-.2-.1-.9.2-1.3.5l-.2-.5a6.497 6.497 0 013.3-1.6c.5 0 .6.6.3 1.6l-.7 2.6c-.1.5-.1.6.1.6a2.003 2.003 0 001.1-.6l.3.4a5.769 5.769 0 01-3 1.6z"
        fill="#2b9be3"
      />
    </svg>
  );
}

export default SvgInfoHollow;
