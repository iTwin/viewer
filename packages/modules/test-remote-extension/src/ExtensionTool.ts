/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { PrimitiveTool } from "@itwin/core-extension";

export class ExtensionTool extends PrimitiveTool {
  public static override hidden = false;
  public static override toolId = "ExtensionTool";
  public static override namespace = "Extensions";
  public static override iconSpec = "icon-select-single";
  public async onRestartTool(): Promise<void> {
    return this.exitTool();
  }
  public override async run(): Promise<boolean> {
    console.log("Extension tool clicked!");
    return super.run();
  }
}
