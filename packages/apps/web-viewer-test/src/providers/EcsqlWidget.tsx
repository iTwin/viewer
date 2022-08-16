/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiFramework } from "@itwin/appui-react";
import { QueryRowFormat } from "@itwin/core-common";
import {
  Button,
  ExpandableBlock,
  LabeledTextarea,
  Table,
} from "@itwin/itwinui-react";
import React, { useState } from "react";

export default function EcsqlWidget() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Record<string, string | React.ReactNode>[]>(
    []
  );
  const [headers, setHeaders] = useState<string[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      setData([]);
      setHeaders([]);
      setIsLoading(true);
      const results = UiFramework.getIModelConnection()!.query(
        input,
        undefined,
        { rowFormat: QueryRowFormat.UseJsPropertyNames }
      );
      const rows: Record<string, string | React.ReactNode>[] = [];
      const headers: string[] = [];

      for await (const obj of results) {
        const row = { ...obj };
        // Case 1: Need to convert booleans to strings to display them in the table
        Object.keys(row)
          .filter((key) => typeof row[key] === "boolean")
          .forEach((key) => {
            row[key] = obj[key].toString();
          });
        // Case 2: Need to stringify objects to display them in the table
        Object.keys(row)
          .filter((key) => typeof row[key] === "object")
          .forEach((key) => {
            row[key] = JSON.stringify(obj[key]);
          });
        // Case 3: If the cell content is too long, put it inside an ExpandableBlock
        Object.keys(row)
          .filter(
            (key) => typeof row[key] === "string" && row[key].length > 500
          )
          .forEach((key) => {
            row[key] = (
              <ExpandableBlock title="..." size="small" styleType="borderless">
                {row[key]}
              </ExpandableBlock>
            );
          });

        rows.push(row);
        for (const key of Object.keys(row)) {
          if (!headers.includes(key)) {
            headers.push(key);
          }
        }
      }
      setData(rows);
      setHeaders(headers);
      setIsLoading(false);
      setError("");
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Header name",
        columns: headers.map((str) => ({
          id: str,
          Header: str,
          accessor: str,
        })),
      },
    ],
    [headers]
  );

  return (
    <div style={{ height: "100%", display: "flex", flexFlow: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "baseline",
          flex: "0 1 auto",
        }}
      >
        <LabeledTextarea
          label=""
          message={error ? error : data.length.toString() + " results"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          status={error ? "negative" : undefined}
          rows={1}
          style={{ flexGrow: 1 }}
        />
        <Button
          as="button"
          styleType="high-visibility"
          disabled={!input}
          onClick={getData}
        >
          Execute
        </Button>
      </div>
      <Table
        enableVirtualization
        columns={columns}
        data={data}
        isSortable={true}
        isResizable={true}
        density="extra-condensed"
        emptyTableContent="No data."
        isLoading={isloading}
        style={{
          flex: "1 1 auto",
          height: "0em",
          width: "100%",
        }}
      />
    </div>
  );
}
