/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { TextString, ViewFlagOverrides } from "@itwin/core-common";
import { ColorDef, LinePixels } from "@itwin/core-common";
import type {
  DecorateContext,
  Decorator,
  GraphicBuilder,
  Marker,
  RenderGraphic,
} from "@itwin/core-frontend";
import { GraphicBranch, GraphicType, IModelApp } from "@itwin/core-frontend";
import type { GeometryQuery } from "@itwin/core-geometry";
import {
  Arc3d,
  CurveChainWithDistanceIndex,
  IndexedPolyface,
  IndexedPolyfaceVisitor,
  LineSegment3d,
  LineString3d,
  Loop,
  Path,
  Point3d,
  Transform,
} from "@itwin/core-geometry";

// Since all geometry is rendered concurrently, when adding geometry, we attach their desired attributes to them in an object
interface CustomGeometryQuery {
  geometry: GeometryQuery;
  color: ColorDef;
  fill: boolean;
  fillColor: ColorDef;
  lineThickness: number;
  edges: boolean;
  linePixels: LinePixels;
}

interface CustomPoint {
  point: Point3d;
  color: ColorDef;
  fill: boolean;
  lineThickness: number;
}

export class GeometryDecorator implements Decorator {
  private image: HTMLImageElement | undefined;

  private graphics: RenderGraphic | undefined;

  private points: CustomPoint[] = [];
  private shapes: CustomGeometryQuery[] = [];
  private text: TextString[] = [];
  private markers: Marker[] = [];

  private fill = false;
  private color: ColorDef = ColorDef.black;
  private fillColor: ColorDef = ColorDef.white;
  private lineThickness = 1;
  private edges = true;
  private linePixels = LinePixels.Solid;

  public addMarker(marker: Marker) {
    this.markers.push(marker);
  }

  public addLine(line: LineSegment3d) {
    const styledGeometry: CustomGeometryQuery = {
      geometry: line,
      color: this.color,
      fill: this.fill,
      fillColor: this.fillColor,
      lineThickness: this.lineThickness,
      edges: this.edges,
      linePixels: this.linePixels,
    };
    this.shapes.push(styledGeometry);
  }

  public addPoint(point: Point3d) {
    const styledPoint: CustomPoint = {
      point,
      color: this.color,
      fill: this.fill,
      lineThickness: this.lineThickness,
    };
    this.points.push(styledPoint);
  }

  public addText(text: TextString) {
    this.text.push(text);
  }

  public addPoints(points: Point3d[]) {
    points.forEach((point) => {
      this.addPoint(point);
    });
  }

  public addGeometry(geometry: GeometryQuery) {
    const styledGeometry: CustomGeometryQuery = {
      geometry,
      color: this.color,
      fill: this.fill,
      fillColor: this.fillColor,
      lineThickness: this.lineThickness,
      edges: this.edges,
      linePixels: this.linePixels,
    };
    this.shapes.push(styledGeometry);
  }

  public addArc(arc: Arc3d) {
    const styledGeometry: CustomGeometryQuery = {
      geometry: arc,
      color: this.color,
      fill: this.fill,
      fillColor: this.fillColor,
      lineThickness: this.lineThickness,
      edges: this.edges,
      linePixels: this.linePixels,
    };
    this.shapes.push(styledGeometry);
  }

  public clearGeometry() {
    this.markers = [];
    this.points = [];
    this.shapes = [];
    this.graphics = undefined;
    IModelApp.viewManager.invalidateDecorationsAllViews();
  }

  public setColor(color: ColorDef) {
    this.color = color;
  }

  public setFill(fill: boolean) {
    this.fill = fill;
  }

  public setFillColor(color: ColorDef) {
    this.fillColor = color;
  }

  public setLineThickness(lineThickness: number) {
    this.lineThickness = lineThickness;
  }

  public setEdges(edges: boolean) {
    this.edges = edges;
  }

  public setLinePixels(linePixels: LinePixels) {
    this.linePixels = linePixels;
  }

  // Iterate through the geometry and point lists, extracting each geometry and point, along with their styles
  // Adding them to the graphic builder which then creates new graphics
  public createGraphics(context: DecorateContext): RenderGraphic | undefined {
    // Specifying an Id for the graphics tells the display system that all of the geometry belongs to the same entity, so that it knows to make sure the edges draw on top of the surfaces.
    const builder = context.createGraphicBuilder(
      GraphicType.Scene,
      undefined,
      context.viewport.iModel.transientIds.getNext()
    );
    // builder.wantNormals = true;
    this.points.forEach((styledPoint) => {
      builder.setSymbology(
        styledPoint.color,
        styledPoint.fill ? styledPoint.color : ColorDef.white,
        styledPoint.lineThickness
      );
      const point = styledPoint.point;
      const circle = Arc3d.createXY(point, 1);
      builder.addArc(circle, false, styledPoint.fill);
    });
    this.shapes.forEach((styledGeometry) => {
      const geometry = styledGeometry.geometry;
      builder.setSymbology(
        styledGeometry.color,
        styledGeometry.fill ? styledGeometry.fillColor : styledGeometry.color,
        styledGeometry.lineThickness,
        styledGeometry.linePixels
      );
      this.createGraphicsForGeometry(geometry, styledGeometry.edges, builder);
    });
    const graphic = builder.finish();
    return graphic;
  }

  private createGraphicsForGeometry(
    geometry: GeometryQuery,
    wantEdges: boolean,
    builder: GraphicBuilder
  ) {
    if (geometry instanceof LineString3d) {
      builder.addLineString(geometry.points);
    } else if (geometry instanceof Loop) {
      builder.addLoop(geometry);
      if (wantEdges) {
        // Since decorators don't natively support visual edges,
        // We draw them manually as lines along each loop edge/arc
        builder.setSymbology(ColorDef.black, ColorDef.black, 2);
        const curves = geometry.children;
        curves.forEach((value) => {
          if (value instanceof LineString3d) {
            let edges = value.points;
            const endPoint = value.pointAt(0);
            if (endPoint) {
              edges = edges.concat([endPoint]);
            }
            builder.addLineString(edges);
          } else if (value instanceof Arc3d) {
            builder.addArc(value, false, false);
          }
        });
      }
    } else if (geometry instanceof Path) {
      builder.addPath(geometry);
    } else if (geometry instanceof IndexedPolyface) {
      builder.addPolyface(geometry, false);
      if (wantEdges) {
        // Since decorators don't natively support visual edges,
        // We draw them manually as lines along each facet edge
        builder.setSymbology(ColorDef.black, ColorDef.black, 2);
        const visitor = IndexedPolyfaceVisitor.create(geometry, 1);
        let flag = true;
        while (flag) {
          const numIndices = visitor.pointCount;
          for (let i = 0; i < numIndices - 1; i++) {
            const point1 = visitor.getPoint(i);
            const point2 = visitor.getPoint(i + 1);
            if (point1 && point2) {
              builder.addLineString([point1, point2]);
            }
          }
          flag = visitor.moveToNextFacet();
        }
      }
    } else if (geometry instanceof LineSegment3d) {
      const pointA = geometry.point0Ref;
      const pointB = geometry.point1Ref;
      const lineString = [pointA, pointB];
      builder.addLineString(lineString);
    } else if (geometry instanceof Arc3d) {
      builder.addArc(geometry, false, false);
    } else if (geometry instanceof CurveChainWithDistanceIndex) {
      this.createGraphicsForGeometry(geometry.path, wantEdges, builder);
    }
  }

  // Generates new graphics if needed, and adds them to the scene
  public decorate(context: DecorateContext): void {
    const overrides: ViewFlagOverrides = {
      lighting: true,
      visibleEdges: true,
    };
    const branch = new GraphicBranch(false);

    branch.setViewFlagOverrides(overrides);

    // context.viewFlags.visibleEdges = true; TODO 3.0
    if (!this.graphics) {
      this.graphics = this.createGraphics(context);
    }

    if (this.graphics) {
      branch.add(this.graphics);
    }

    const graphic = context.createBranch(branch, Transform.identity);
    context.addDecoration(GraphicType.Scene, graphic);

    this.markers.forEach((marker) => {
      marker.addDecoration(context);
    });
  }

  // Draws a base for the 3d geometry
  public drawBase(
    origin: Point3d = new Point3d(0, 0, 0),
    width = 20,
    length = 20
  ) {
    const oldEdges = this.edges;
    const oldColor = this.color;
    this.edges = false;
    const points: Point3d[] = [];
    points.push(
      Point3d.create(
        origin.x - width / 2,
        origin.y - length / 2,
        origin.z - 0.05
      )
    );
    points.push(
      Point3d.create(
        origin.x - width / 2,
        origin.y + length / 2,
        origin.z - 0.05
      )
    );
    points.push(
      Point3d.create(
        origin.x + width / 2,
        origin.y + length / 2,
        origin.z - 0.05
      )
    );
    points.push(
      Point3d.create(
        origin.x + width / 2,
        origin.y - length / 2,
        origin.z - 0.05
      )
    );
    const linestring = LineString3d.create(points);
    const loop = Loop.create(linestring.clone());
    this.setColor(
      ColorDef.fromTbgr(ColorDef.withTransparency(ColorDef.green.tbgr, 150))
    );
    this.addGeometry(loop);
    this.color = oldColor;
    this.edges = oldEdges;
  }
}
