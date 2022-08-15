/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiFramework } from "@itwin/appui-react";
import { QueryRowFormat } from "@itwin/core-common";
import { Button, LabeledTextarea, Table } from "@itwin/itwinui-react";
import React, { useState } from "react";

export default function EcsqlWidget() {
  const [input, setInput] = useState<string>("");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isloading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getData = async () => {
    try {
      setRows([]);
      setHeaders([]);
      setLoading(true);
      const results = UiFramework.getIModelConnection()!.query(
        input,
        undefined,
        { rowFormat: QueryRowFormat.UseJsPropertyNames }
      );
      const rows = [];
      for await (const obj of results) {
        const row = { ...obj };
        Object.keys(row)
          .filter((key) => typeof row[key] === "object")
          .forEach((key) => {
            row[key] = JSON.stringify(obj[key]);
          });
        rows.push(row);
      }
      setRows(rows);
      setHeaders(Object.keys(rows[0]));
      setLoading(false);
      setError("");
    } catch (err: any) {
      setLoading(false);
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
          width: 300,
        })),
      },
    ],
    [headers]
  );
  const data = rows;

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
