export { p1, p2 };
const p1 = `<!DOCTYPE html>
<html>
  <style>
    body {
      height: 100%;
      margin: 0;
      overflow: hidden;
      background-color: #f0f0f0;
    }

    h1 {
      color: blue;
    }

    p {
      color: red;
    }

    #c {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  </style>

  <head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js"></script>
    <script src="https://unpkg.com/p5.js-svg@1.1.1"></script>
    <script type="text/javascript" language="javascript">
      const transactionHash =
        "`;
const p2 = `";

var seed = xmur3(transactionHash);
var rand = mulberry32(seed());
const pulseFreq = 1;
const rotationFreq = 0.01;
const phasing = 0.01;
const rationales = 0.7;
// console.log(rand(), rand(), rand())

const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

var canvas;
const nbPointsMin = 8;
const nbPointsMax = 24;

const nbPointillesMaxChoices = [100];
var nbPointillesMax = 100;
const minLineThicknessPositionChoices = [0.25, 0.5, 0.75];
var minLineThicknessPosition;
const minLineThicknessChoices = [0.1];
var minLineThickness;
const maxLineThicknessChoices = [6, 8, 10];
var maxLineThickness;
const dashThicknessChoices = [0.5, 1];
var dashThickness;
const dashGapChoices = [20, 10];
var dashGap;
const dashLenChoices = [5, 10];
var dashLen;

const minPointSize = 5;
const maxPointSize = 10;
const formFactor = 200;

// ---- ALRIGHT YOU CAN STOP NOW

const BASE_SIZE = 1000;
const BASE_BALL_NB = 32;
const BASE_OFFSET = 10;

const spacing_x = 25;
const spacing_y = 25;
var ps = 0.5;

var nbBallsX;
var nbBallsY;

var offsetX;
var offsetY;

var balls = [];
var points = [];
var hullpts = [];
var pathpts = [];
var lines = [];
// var organics = [];
var outlineColor;

const outlineColors = [
  [249, 136, 102],
  [255, 66, 14],
  [13, 189, 158],
  [137, 218, 89],
  [144, 175, 19],
  [51, 107, 135],
  [42, 49, 50],
  [118, 54, 38],
  [55, 94, 151],
  [251, 101, 66],
  [255, 187, 0],
  [63, 104, 28],
];

window.addEventListener("resize", () => {
  resize();
});

function resize() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  // canvas.position(x, y);
  // canvas.width = ;
  // canvas.height = window.innerHeight;
  // w = ;
  // h = ;

  let smallDim;

  let newWidth, newHeight;
  const oldW = spacing_x * ps * nbBallsX;
  const oldH = spacing_y * ps * nbBallsY;
  if (oldW / window.innerWidth > oldH / window.innerHeight) {
    smallDim = window.innerWidth;
    newWidth = smallDim;
    ps = smallDim / BASE_SIZE;
    ps = ps * 1.25;
    const h = spacing_y * ps * nbBallsY;

    newHeight = h;
  } else {
    smallDim = window.innerHeight;
    newHeight = smallDim;
    ps = smallDim / BASE_SIZE;
    ps = ps * 1.25;
    const w = spacing_x * ps * nbBallsX;

    newWidth = w;
  }
  resizeCanvas(newWidth, newHeight);
  console.log("new size", width, height);
}

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

//MAIN SCRIPT HERE

function randInt(num) {
  return Math.floor(rand() * num);
}

function randChoose(arr) {
  return arr[randInt(arr.length)];
}

function randomColor(trp = 255) {
  const ind = Math.floor(rand() * outlineColors.length);
  return color(...outlineColors[ind], trp);
}

function setup() {
  // frameRate(1);
  console.log("transactionHash=", transactionHash);

  const randomNumbber = 4 * (randInt(5) + 1);
  console.log("randomNumber=", randomNumbber);

  const ratio = randomNumbber / 12;
  minLineThicknessPosition = randChoose(minLineThicknessPositionChoices);
  minLineThickness = randChoose(minLineThicknessChoices);
  maxLineThickness = randChoose(maxLineThicknessChoices);
  dashThickness = randChoose(dashThicknessChoices);
  nbPointillesMax = randChoose(nbPointillesMaxChoices);
  dashGap = randChoose(dashGapChoices);
  dashLen = randChoose(dashLenChoices);

  const invRatio = 1 / ratio;

  if (ratio > 1) {
    nbBallsX = BASE_BALL_NB;
    nbBallsY = invRatio * BASE_BALL_NB;
  } else {
    nbBallsX = ratio * BASE_BALL_NB;
    nbBallsY = BASE_BALL_NB;
  }

  for (let i = 0; i < Math.floor(nbBallsX); i++) {
    for (let j = 0; j < Math.floor(nbBallsY); j++) {
      balls.push(new Ball(i, j));
    }
  }

  outlineColor = randomColor();

  canvas = createCanvas(BASE_SIZE, BASE_SIZE, SVG);
  canvas.id("c");
  resize();

  offsetX = BASE_OFFSET; // (width - (nbBallsX - 1) * spacing_x) / 2;
  offsetY = BASE_OFFSET; // (height - (nbBallsY - 1) * spacing_y) / 2;

  Restart();
}

function draw() {
  background(240);

  hullpts.forEach((point) => {
    //points
    fill(0, 0, 0);
    // noFill();
    noStroke();
    ellipse(
      point[0] * ps,
      point[1] * ps,
      (10 + Math.floor(rand() * 5)) * ps
    );
  });
  // balls.forEach((ball) => {
  //   ball.show();
  // });

  // beginShape();
  // hullpts.forEach((point) => {
  //   // fill(240);
  //   noFill();

  //   vertex(point[0] * ps, point[1] * ps);
  // });
  // endShape();

  var opx = hullpts[0][0];
  var opy = hullpts[0][1];

  stroke(outlineColor);
  strokeWeight(2);
  hullpts.forEach((point) => {
    // stroke(255, 140, 0);
    gradientLine(
      opx * ps,
      opy * ps,
      point[0] * ps,
      point[1] * ps,
      minLineThickness * ps,
      maxLineThickness * ps,
      100
    );
    // line(opx, opy, point[0], point[1]);
    opx = point[0];
    opy = point[1];
  });

  lines.forEach((l) => {
    stroke(100, 100, 100, 100);
    strokeWeight(dashThickness * ps);
    line(l[0] * ps, l[1] * ps, l[2] * ps, l[3] * ps);
  });

  // save("mySVG.svg"); // give file name
  // print("saved svg");
  noLoop(); // we just want to export once
}

function Restart(player) {
  // console.log("Spacing = ", spacing_x, spacing_y);

  balls.forEach((ball) => {
    ball.pos.x = spacing_x * ball.index_x + offsetX;
    ball.pos.y = spacing_y * ball.index_y + offsetY;
  });

  var lastIndex = Math.floor(rand() * 74318);
  var pointset = [];
  for (
    let i = 0;
    i < nbPointsMin + Math.floor(rand() * (nbPointsMax - nbPointsMin));
    i++
  ) {
    const index2 = Math.floor(rand() * balls.length);
    points.push(balls[index2]);
    pointset.push([balls[index2].pos.x, balls[index2].pos.y]);
    lastIndex = index2;
  }

  hullpts = hull(pointset, formFactor);
  console.log(hullpts.length, points.length);
  console.log(hullpts);

  for (let i = 0; i < nbPointillesMax; i++) {
    const i1 = Math.floor(rand() * hullpts.length);
    const i2 = Math.floor(rand() * hullpts.length);
    if (Math.abs(i1 - i2) > 2) {
      // console.log("indexes = ", i1, i2);
      const b1 = hullpts[i1];
      const b2 = hullpts[i2];
      drawingContext.setLineDash([dashLen * ps, dashGap * ps]);
      // if (doesnent_intersect(b1[0], b1[1], b2[0], b2[1])) {

      lines.push([b1[0], b1[1], b2[0], b2[1]]);
      // } else {
      //   stroke(255, 0, 0);
      // }
    }
  }
}

function gradientLine(
  start_x,
  start_y,
  end_x,
  end_y,
  start_weight,
  end_weight,
  segments
) {
  let prev_loc_x = start_x;
  let prev_loc_y = start_y;
  let mid_point_x = lerp(start_x, end_x, minLineThicknessPosition);
  let mid_point_y = lerp(start_y, end_y, minLineThicknessPosition);

  for (let i = 1; i <= segments; i++) {
    let cur_loc_x = lerp(start_x, mid_point_x, i / segments);
    let cur_loc_y = lerp(start_y, mid_point_y, i / segments);
    push();
    strokeWeight(lerp(start_weight, end_weight, 1 - i / segments));
    line(prev_loc_x, prev_loc_y, cur_loc_x, cur_loc_y);
    pop();
    prev_loc_x = cur_loc_x;
    prev_loc_y = cur_loc_y;
  }

  prev_loc_x = mid_point_x;
  prev_loc_y = mid_point_y;
  // let mid_point_x = lerp(start_x, end_x, 0.5);
  // let mid_point_y = lerp(start_y, end_y, 0.5);

  for (let i = 1; i <= segments; i++) {
    let cur_loc_x = lerp(mid_point_x, end_x, i / segments);
    let cur_loc_y = lerp(mid_point_y, end_y, i / segments);
    push();
    strokeWeight(lerp(start_weight, end_weight, i / segments));
    line(prev_loc_x, prev_loc_y, cur_loc_x, cur_loc_y);
    pop();
    prev_loc_x = cur_loc_x;
    prev_loc_y = cur_loc_y;
  }
}

function Ball(index_x, index_y) {
  this.pos = createVector();
  this.index_x = index_x;
  this.index_y = index_y;
  this.pos.x = 0;
  this.pos.y = 0;
  this.size = 1;

  this.show = function () {
    fill(100);
    noStroke();
    ellipse(
      this.pos.x * ps,
      this.pos.y * ps,
      2 * this.size * ps,
      2 * this.size * ps
    );
  };
}
//END MAIN SCRIPT

//HULL.JS --------------------------------------------------------------------------------------------------------
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.hull = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          function _cross(o, a, b) {
            return (
              (a[0] - o[0]) * (b[1] - o[1]) -
              (a[1] - o[1]) * (b[0] - o[0])
            );
          }

          function _upperTangent(pointset) {
            const lower = [];
            for (let l = 0; l < pointset.length; l++) {
              while (
                lower.length >= 2 &&
                _cross(
                  lower[lower.length - 2],
                  lower[lower.length - 1],
                  pointset[l]
                ) <= 0
              ) {
                lower.pop();
              }
              lower.push(pointset[l]);
            }
            lower.pop();
            return lower;
          }

          function _lowerTangent(pointset) {
            const reversed = pointset.reverse(),
              upper = [];
            for (let u = 0; u < reversed.length; u++) {
              while (
                upper.length >= 2 &&
                _cross(
                  upper[upper.length - 2],
                  upper[upper.length - 1],
                  reversed[u]
                ) <= 0
              ) {
                upper.pop();
              }
              upper.push(reversed[u]);
            }
            upper.pop();
            return upper;
          }

          // pointset has to be sorted by X
          function convex(pointset) {
            const upper = _upperTangent(pointset),
              lower = _lowerTangent(pointset);
            const convex = lower.concat(upper);
            convex.push(pointset[0]);
            return convex;
          }

          module.exports = convex;
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          module.exports = {
            toXy: function (pointset, format) {
              if (format === undefined) {
                return pointset.slice();
              }
              return pointset.map(function (pt) {
                /*jslint evil: true */
                const _getXY = new Function(
                  "pt",
                  "return [pt" + format[0] + "," + "pt" + format[1] + "];"
                );
                return _getXY(pt);
              });
            },

            fromXy: function (pointset, format) {
              if (format === undefined) {
                return pointset.slice();
              }
              return pointset.map(function (pt) {
                /*jslint evil: true */
                const _getObj = new Function(
                  "pt",
                  "const o = {}; o" +
                    format[0] +
                    "= pt[0]; o" +
                    format[1] +
                    "= pt[1]; return o;"
                );
                return _getObj(pt);
              });
            },
          };
        },
        {},
      ],
      3: [
        function (require, module, exports) {
          function Grid(points, cellSize) {
            this._cells = [];
            this._cellSize = cellSize;
            this._reverseCellSize = 1 / cellSize;

            for (let i = 0; i < points.length; i++) {
              const point = points[i];
              const x = this.coordToCellNum(point[0]);
              const y = this.coordToCellNum(point[1]);
              if (!this._cells[x]) {
                const array = [];
                array[y] = [point];
                this._cells[x] = array;
              } else if (!this._cells[x][y]) {
                this._cells[x][y] = [point];
              } else {
                this._cells[x][y].push(point);
              }
            }
          }

          Grid.prototype = {
            cellPoints: function (x, y) {
              // (Number, Number) -> Array
              return this._cells[x] !== undefined &&
                this._cells[x][y] !== undefined
                ? this._cells[x][y]
                : [];
            },

            rangePoints: function (bbox) {
              // (Array) -> Array
              const tlCellX = this.coordToCellNum(bbox[0]);
              const tlCellY = this.coordToCellNum(bbox[1]);
              const brCellX = this.coordToCellNum(bbox[2]);
              const brCellY = this.coordToCellNum(bbox[3]);
              const points = [];

              for (let x = tlCellX; x <= brCellX; x++) {
                for (let y = tlCellY; y <= brCellY; y++) {
                  // replaced Array.prototype.push.apply to avoid hitting stack size limit on larger arrays.
                  for (let i = 0; i < this.cellPoints(x, y).length; i++) {
                    points.push(this.cellPoints(x, y)[i]);
                  }
                }
              }

              return points;
            },

            removePoint: function (point) {
              // (Array) -> Array
              const cellX = this.coordToCellNum(point[0]);
              const cellY = this.coordToCellNum(point[1]);
              const cell = this._cells[cellX][cellY];
              let pointIdxInCell;

              for (let i = 0; i < cell.length; i++) {
                if (cell[i][0] === point[0] && cell[i][1] === point[1]) {
                  pointIdxInCell = i;
                  break;
                }
              }

              cell.splice(pointIdxInCell, 1);

              return cell;
            },

            trunc:
              Math.trunc ||
              function (val) {
                // (number) -> number
                return val - (val % 1);
              },

            coordToCellNum: function (x) {
              // (number) -> number
              return this.trunc(x * this._reverseCellSize);
            },

            extendBbox: function (bbox, scaleFactor) {
              // (Array, Number) -> Array
              return [
                bbox[0] - scaleFactor * this._cellSize,
                bbox[1] - scaleFactor * this._cellSize,
                bbox[2] + scaleFactor * this._cellSize,
                bbox[3] + scaleFactor * this._cellSize,
              ];
            },
          };

          function grid(points, cellSize) {
            return new Grid(points, cellSize);
          }

          module.exports = grid;
        },
        {},
      ],
      4: [
        function (require, module, exports) {
          /*
 (c) 2014-2020, Andrii Heonia
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndriiHeonia/hull
*/

          "use strict";

          const intersect = require("./intersect.js");
          const grid = require("./grid.js");
          const formatUtil = require("./format.js");
          const convexHull = require("./convex.js");

          function _filterDuplicates(pointset) {
            const unique = [pointset[0]];
            let lastPoint = pointset[0];
            for (let i = 1; i < pointset.length; i++) {
              const currentPoint = pointset[i];
              if (
                lastPoint[0] !== currentPoint[0] ||
                lastPoint[1] !== currentPoint[1]
              ) {
                unique.push(currentPoint);
              }
              lastPoint = currentPoint;
            }
            return unique;
          }

          function _sortByX(pointset) {
            return pointset.sort(function (a, b) {
              return a[0] - b[0] || a[1] - b[1];
            });
          }

          function _sqLength(a, b) {
            return Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
          }

          function _cos(o, a, b) {
            const aShifted = [a[0] - o[0], a[1] - o[1]],
              bShifted = [b[0] - o[0], b[1] - o[1]],
              sqALen = _sqLength(o, a),
              sqBLen = _sqLength(o, b),
              dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

            return dot / Math.sqrt(sqALen * sqBLen);
          }

          function _intersect(segment, pointset) {
            for (let i = 0; i < pointset.length - 1; i++) {
              const seg = [pointset[i], pointset[i + 1]];
              if (
                (segment[0][0] === seg[0][0] &&
                  segment[0][1] === seg[0][1]) ||
                (segment[0][0] === seg[1][0] &&
                  segment[0][1] === seg[1][1])
              ) {
                continue;
              }
              if (intersect(segment, seg)) {
                return true;
              }
            }
            return false;
          }

          function _occupiedArea(pointset) {
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            for (let i = pointset.length - 1; i >= 0; i--) {
              if (pointset[i][0] < minX) {
                minX = pointset[i][0];
              }
              if (pointset[i][1] < minY) {
                minY = pointset[i][1];
              }
              if (pointset[i][0] > maxX) {
                maxX = pointset[i][0];
              }
              if (pointset[i][1] > maxY) {
                maxY = pointset[i][1];
              }
            }

            return [
              maxX - minX, // width
              maxY - minY, // height
            ];
          }

          function _bBoxAround(edge) {
            return [
              Math.min(edge[0][0], edge[1][0]), // left
              Math.min(edge[0][1], edge[1][1]), // top
              Math.max(edge[0][0], edge[1][0]), // right
              Math.max(edge[0][1], edge[1][1]), // bottom
            ];
          }

          function _midPoint(edge, innerPoints, convex) {
            let point = null,
              angle1Cos = MAX_CONCAVE_ANGLE_COS,
              angle2Cos = MAX_CONCAVE_ANGLE_COS,
              a1Cos,
              a2Cos;

            for (let i = 0; i < innerPoints.length; i++) {
              a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
              a2Cos = _cos(edge[1], edge[0], innerPoints[i]);

              if (
                a1Cos > angle1Cos &&
                a2Cos > angle2Cos &&
                !_intersect([edge[0], innerPoints[i]], convex) &&
                !_intersect([edge[1], innerPoints[i]], convex)
              ) {
                angle1Cos = a1Cos;
                angle2Cos = a2Cos;
                point = innerPoints[i];
              }
            }

            return point;
          }

          function _concave(
            convex,
            maxSqEdgeLen,
            maxSearchArea,
            grid,
            edgeSkipList
          ) {
            let midPointInserted = false;

            for (let i = 0; i < convex.length - 1; i++) {
              const edge = [convex[i], convex[i + 1]];
              // generate a key in the format X0,Y0,X1,Y1
              const keyInSkipList =
                edge[0][0] +
                "," +
                edge[0][1] +
                "," +
                edge[1][0] +
                "," +
                edge[1][1];

              if (
                _sqLength(edge[0], edge[1]) < maxSqEdgeLen ||
                edgeSkipList.has(keyInSkipList)
              ) {
                continue;
              }

              let scaleFactor = 0;
              let bBoxAround = _bBoxAround(edge);
              let bBoxWidth;
              let bBoxHeight;
              let midPoint;
              do {
                bBoxAround = grid.extendBbox(bBoxAround, scaleFactor);
                bBoxWidth = bBoxAround[2] - bBoxAround[0];
                bBoxHeight = bBoxAround[3] - bBoxAround[1];

                midPoint = _midPoint(
                  edge,
                  grid.rangePoints(bBoxAround),
                  convex
                );
                scaleFactor++;
              } while (
                midPoint === null &&
                (maxSearchArea[0] > bBoxWidth ||
                  maxSearchArea[1] > bBoxHeight)
              );

              if (
                bBoxWidth >= maxSearchArea[0] &&
                bBoxHeight >= maxSearchArea[1]
              ) {
                edgeSkipList.add(keyInSkipList);
              }

              if (midPoint !== null) {
                convex.splice(i + 1, 0, midPoint);
                grid.removePoint(midPoint);
                midPointInserted = true;
              }
            }

            if (midPointInserted) {
              return _concave(
                convex,
                maxSqEdgeLen,
                maxSearchArea,
                grid,
                edgeSkipList
              );
            }

            return convex;
          }

          function hull(pointset, concavity, format) {
            let maxEdgeLen = concavity || 20;

            const points = _filterDuplicates(
              _sortByX(formatUtil.toXy(pointset, format))
            );

            if (points.length < 4) {
              return points.concat([points[0]]);
            }

            const occupiedArea = _occupiedArea(points);
            const maxSearchArea = [
              occupiedArea[0] * MAX_SEARCH_BBOX_SIZE_PERCENT,
              occupiedArea[1] * MAX_SEARCH_BBOX_SIZE_PERCENT,
            ];

            const convex = convexHull(points);
            const innerPoints = points.filter(function (pt) {
              return convex.indexOf(pt) < 0;
            });

            const cellSize = Math.ceil(
              1 / (points.length / (occupiedArea[0] * occupiedArea[1]))
            );

            const concave = _concave(
              convex,
              Math.pow(maxEdgeLen, 2),
              maxSearchArea,
              grid(innerPoints, cellSize),
              new Set()
            );

            if (format) {
              return formatUtil.fromXy(concave, format);
            } else {
              return concave;
            }
          }

          const MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
          const MAX_SEARCH_BBOX_SIZE_PERCENT = 0.6;

          module.exports = hull;
        },
        {
          "./convex.js": 1,
          "./format.js": 2,
          "./grid.js": 3,
          "./intersect.js": 5,
        },
      ],
      5: [
        function (require, module, exports) {
          function ccw(x1, y1, x2, y2, x3, y3) {
            const cw = (y3 - y1) * (x2 - x1) - (y2 - y1) * (x3 - x1);
            return cw > 0 ? true : cw < 0 ? false : true; // colinear
          }

          function intersect(seg1, seg2) {
            const x1 = seg1[0][0],
              y1 = seg1[0][1],
              x2 = seg1[1][0],
              y2 = seg1[1][1],
              x3 = seg2[0][0],
              y3 = seg2[0][1],
              x4 = seg2[1][0],
              y4 = seg2[1][1];

            return (
              ccw(x1, y1, x3, y3, x4, y4) !==
                ccw(x2, y2, x3, y3, x4, y4) &&
              ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4)
            );
          }

          module.exports = intersect;
        },
        {},
      ],
    },
    {},
    [4]
  )(4);
});

//END HULL.JS
</script>
</head>

<body></body>
</html>
`;
