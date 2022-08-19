/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useActiveIModelConnection } from "@itwin/appui-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const iModelConnection = useActiveIModelConnection();

  const getData = async () => {
    if (!iModelConnection) {
      return;
    }
    try {
      setData([]);
      setHeaders([]);
      setIsLoading(true);
      const results = iModelConnection.query(input, undefined, {
        rowFormat: QueryRowFormat.UseJsPropertyNames,
      });
      const rows: Record<string, string | React.ReactNode>[] = [];
      const columnHeaders: string[] = [];

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
          if (!columnHeaders.includes(key)) {
            columnHeaders.push(key);
          }
        }
      }
      setData(rows);
      setHeaders(columnHeaders);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
          width: 300,
          minWidth: 100,
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
          message={
            isLoading
              ? "Loading..."
              : error || data.length.toString() + " results"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          status={error && !isLoading ? "negative" : undefined}
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
        columns={columns}
        data={data}
        isSortable={true}
        isResizable={true}
        density="extra-condensed"
        emptyTableContent="No data."
        isLoading={isLoading}
        style={{
          flex: "1 1 auto",
          height: "0em",
          width: "100%",
        }}
      />
    </div>
  );
}
