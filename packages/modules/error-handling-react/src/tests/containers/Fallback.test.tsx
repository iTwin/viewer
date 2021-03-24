/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render } from "@testing-library/react";
import React from "react";

import svg401 from "../../../images/401-9ZUI-WEB.svg";
import svg403 from "../../../images/403-9ZUI-WEB.svg";
import svg404 from "../../../images/404-WEB.svg";
import svg500 from "../../../images/500-WEB.svg";
import svg503 from "../../../images/503-WEB.svg";
import svgGen from "../../../images/Generic-WEB.svg";
import { Fallback } from "../../containers/Fallback";
import { iTwinErrorI18n } from "../../util/i18n";

const getElementsBasedOnProps = (
  message: string | undefined,
  translate: boolean
) => {
  const { getByTestId } = render(
    <Fallback message={message} translate={translate} />
  );
  const img = getByTestId("test-fallback-img");
  const title = getByTestId("test-fallback-title");
  const text = getByTestId("test-fallback-text");
  return { img, title, text };
};

describe("Fallback.tsx Tests", () => {
  test("Test Fallback Generic", () => {
    const { img, title, text } = getElementsBasedOnProps(undefined, true);
    expect(img.getAttribute("src")).toBe(svgGen);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAltGen"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitleGen"));
    expect(text.innerHTML).toBe("");
  });

  test("Test Fallback 401", () => {
    const { img, title, text } = getElementsBasedOnProps("error401", true);
    expect(img.getAttribute("src")).toBe(svg401);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAlt401"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitle401"));
    expect(text.innerHTML).toBe(iTwinErrorI18n.t("error401"));
  });

  test("Test Fallback 403", () => {
    const { img, title, text } = getElementsBasedOnProps("error403", true);
    expect(img.getAttribute("src")).toBe(svg403);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAlt403"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitle403"));
    expect(text.innerHTML).toBe(iTwinErrorI18n.t("error403"));
  });

  test("Test Fallback 404", () => {
    const { img, title, text } = getElementsBasedOnProps("error404", true);
    expect(img.getAttribute("src")).toBe(svg404);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAlt404"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitle404"));
    expect(text.innerHTML).toBe(iTwinErrorI18n.t("error404"));
  });

  test("Test Fallback 500", () => {
    const { img, title, text } = getElementsBasedOnProps("error500", true);
    expect(img.getAttribute("src")).toBe(svg500);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAlt500"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitle500"));
    expect(text.innerHTML).toBe(iTwinErrorI18n.t("error500"));
  });

  test("Test Fallback 503", () => {
    const { img, title, text } = getElementsBasedOnProps("error503", true);
    expect(img.getAttribute("src")).toBe(svg503);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAlt503"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitle503"));
    expect(text.innerHTML).toBe(iTwinErrorI18n.t("error503"));
  });

  test("Test Fallback No Translate", () => {
    const { img, title, text } = getElementsBasedOnProps("No Translate", false);
    expect(img.getAttribute("src")).toBe(svgGen);
    expect(img.getAttribute("alt")).toBe(iTwinErrorI18n.t("fallbackAltGen"));
    expect(title.innerHTML).toBe(iTwinErrorI18n.t("fallbackTitleGen"));
    expect(text.innerHTML).toBe("No Translate");
  });
});
