const p5 = require('node-p5');
export { createAndSaveCanvas }
const hull = require("./hull")
//SAVE CANVAS
// const fs = require('fs')
const fs = require('memfs')
const FormData = require("form-data");
const axios = require("axios");

var transactionHash = "";
var callback = null;
var pfive;

function sketch(p) {
  try {
    console.log("Sketch P5...")
    p.setup = async () => {
      pfive = p
      let canvas = setup(p);
      draw(p)

      console.log("Setup done")
      const pinataHash = await saveCanvas(canvas, 'myCanvas', 'png');
      callback(pinataHash)
      p.noLoop();
    }
    p.draw = async () => { }
    console.log("Sketch Done!");
  } catch (error) {
    console.log(error);
  }
}
async function createAndSaveCanvas(hash: string, call: any) {
  callback = call;
  transactionHash = hash;
  console.log("transactionHash : ", transactionHash);
  console.log("Starting...");
  let p5Instance = p5.createSketch(sketch);
  console.log("Done in new york")
}

async function saveCanvas(c, f, ext) {
  let extensions = ['png', 'jpg'];
  let f_arr = f.split('.');
  if (!extensions.includes(f_arr[f_arr.length - 1])) {
    if (ext) {
      f = `${f}.${ext}`;
    } else {
      f = `${f}.png`;
    }
  }
  try {
    // fs.writeFileSync('C:Users/User/Documents/GitHub/ChaosNfts/chaos-app/utils/p5/CHAOS.png', getCanvasDataURL(c).replace(/^data:image\/png;base64,/, ""), 'base64')
    fs.writeFileSync('/CHAOS.png', getCanvasDataURL(c).replace(/^data:image\/png;base64,/, ""), 'base64')
    console.log("Create file :", f)
    return await pinToPinataAxios()
  } catch (error) {
    console.log(error)
  }
}

// GET CANVAS DATA URL
function getCanvasDataURL(c) {
  return c.canvas.toDataURL();
}

async function pinToPinataAxios() {
  let dataform = new FormData();
  const streame = fs.createReadStream("/CHAOS" + ".png", "utf-8");
  dataform.append("file", streame);
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  console.log("Pinning File...");
  // console.log("dataform :", streame);
  var res = await axios
    .post(url, dataform, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${dataform._boundary}`,
        pinata_api_key: "170fe7a155cc7cbc5721", // process.env.PINATA_1 //TODO : put back dotenv
        pinata_secret_api_key:
          "3a2c6241986cc68a359daf661dcb40557d9d841b07958ed713815118da3db408", // process.env.PINATA_2
      },
    })
    .then((response) => {
      console.log("Filed" + "Pinned! Hash :");
      console.log(response.data.IpfsHash);
      return response.data.IpfsHash;
    })
    .catch((error) => {
      console.log("pinToPinataAxios() ERROR :", error);
    });
  console.log("res = ", res);
  return res;
}

////////////////////////////////////////////// Code de Turcotte //////////////////////////////////////////////
let seed = null;
var rand = null;
const pulseFreq = 1;
const rotationFreq = 0.01;
const phasing = 0.01;
const rationales = 0.7;

const innerWidth = 1000;//window.innerWidth;
const innerHeight = 1000;//window.innerHeight;

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
const BASE_OFFSET = 100;

const spacing_x = 25;
const spacing_y = 25;

var nbBallsX;
var nbBallsY;
var offsetX;
var offsetY;
var balls
var points
var hullpts
var pathpts
var lines
var outlineColor;

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

function randInt(num) {
  return Math.floor(rand() * num);
}

function randChoose(arr) {
  return arr[randInt(arr.length)];
}

function randomColor(trp, p5) {
  const ind = Math.floor(rand() * outlineColors.length);
  return p5.color(...outlineColors[ind], trp);
}

function resetVariables() {
  balls = [];
  points = [];
  hullpts = [];
  pathpts = [];
  lines = [];
}

function setup(p5) {
  //reset old variables
  resetVariables()

  console.log("transactionHash=", transactionHash);

  seed = xmur3(transactionHash);
  rand = mulberry32(seed());
  const randomNumbber = 4 * (randInt(5) + 1);
  console.log("randomNumber=", randomNumbber);

  minLineThicknessPosition = randChoose(minLineThicknessPositionChoices);
  minLineThickness = randChoose(minLineThicknessChoices);
  maxLineThickness = randChoose(maxLineThicknessChoices);
  dashThickness = randChoose(dashThicknessChoices);
  nbPointillesMax = randChoose(nbPointillesMaxChoices);
  dashGap = randChoose(dashGapChoices);
  dashLen = randChoose(dashLenChoices);

  const ratio = randomNumbber / 12;
  const invRatio = 1 / ratio;
  // console.log("invRatio = ", invRatio);

  if (ratio > 1) {
    nbBallsX = BASE_BALL_NB;
    nbBallsY = invRatio * BASE_BALL_NB;
  } else {
    nbBallsX = ratio * BASE_BALL_NB;
    nbBallsY = BASE_BALL_NB;
  }

  for (let i = 0; i < Math.floor(nbBallsX); i++) {
    for (let j = 0; j < Math.floor(nbBallsY); j++) {
      balls.push(new Ball(i, j, p5));
    }
  }
  const trp = 255;
  outlineColor = randomColor(trp, p5);

  canvas = p5.createCanvas(BASE_SIZE, BASE_SIZE); // Avait SVG en 3ieme paramètre mais talk shit
  // resize();

  offsetX = (p5.width - (nbBallsX - 1) * spacing_x) / 2;
  offsetY = (p5.height - (nbBallsY - 1) * spacing_y) / 2;

  Restart(p5);
  console.log("Returned from setup")
  return canvas;
}

function draw(p5) {
  console.log("Drawing...");

  p5.background(240);

  hullpts.forEach((point) => {
    p5.fill(0, 0, 0);
    p5.noStroke();
    p5.ellipse(point[0], point[1], 10 + Math.floor(rand() * 5));
  });

  // p5.beginShape();
  // hullpts.forEach((point) => {
  //   p5.noFill();

  //   p5.vertex(point[0], point[1]);
  // });
  // p5.endShape();

  var opx = hullpts[0][0];
  var opy = hullpts[0][1];

  p5.stroke(outlineColor);
  p5.strokeWeight(2);
  hullpts.forEach((point) => {
    gradientLine(opx, opy, point[0], point[1], minLineThickness, maxLineThickness, 100, p5);
    opx = point[0];
    opy = point[1];
  });

  lines.forEach((l) => {
    p5.stroke(100, 100, 100, 100);
    p5.strokeWeight(dashThickness);
    p5.line(l[0], l[1], l[2], l[3]);
  });
  // save("mySVG.svg"); // give file name
  p5.noLoop(); // we just want to export once

  console.log("Drawing Done")
}

function Restart(p5) {
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
  // console.log(hullpts.length, points.length);
  // console.log(hullpts);

  for (let i = 0; i < nbPointillesMax; i++) {
    const i1 = Math.floor(rand() * hullpts.length);
    const i2 = Math.floor(rand() * hullpts.length);
    if (Math.abs(i1 - i2) > 2) {
      const b1 = hullpts[i1];
      const b2 = hullpts[i2];
      p5.drawingContext.setLineDash([dashLen, dashGap]);
      lines.push([b1[0], b1[1], b2[0], b2[1]]);
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
  segments,
  p5
) {
  let prev_loc_x = start_x;
  let prev_loc_y = start_y;
  let mid_point_x = p5.lerp(start_x, end_x, minLineThicknessPosition);
  let mid_point_y = p5.lerp(start_y, end_y, minLineThicknessPosition);

  for (let i = 1; i <= segments; i++) {
    let cur_loc_x = p5.lerp(start_x, mid_point_x, i / segments);
    let cur_loc_y = p5.lerp(start_y, mid_point_y, i / segments);
    p5.push();
    p5.strokeWeight(p5.lerp(start_weight, end_weight, 1 - i / segments));
    p5.line(prev_loc_x, prev_loc_y, cur_loc_x, cur_loc_y);
    p5.pop();
    prev_loc_x = cur_loc_x;
    prev_loc_y = cur_loc_y;
  }

  prev_loc_x = mid_point_x;
  prev_loc_y = mid_point_y;

  for (let i = 1; i <= segments; i++) {
    let cur_loc_x = p5.lerp(mid_point_x, end_x, i / segments);
    let cur_loc_y = p5.lerp(mid_point_y, end_y, i / segments);
    p5.push();
    p5.strokeWeight(p5.lerp(start_weight, end_weight, i / segments));
    p5.line(prev_loc_x, prev_loc_y, cur_loc_x, cur_loc_y);
    p5.pop();
    prev_loc_x = cur_loc_x;
    prev_loc_y = cur_loc_y;
  }
}

function Ball(index_x, index_y, p5) {
  this.pos = p5.createVector();
  this.index_x = index_x;
  this.index_y = index_y;
  this.pos.x = 0;
  this.pos.y = 0;

  this.show = function () {
    p5.fill(100);
    p5.noStroke();
    const posScale = 1;
    p5.ellipse(
      this.pos.x * posScale,
      this.pos.y * posScale,
      2 * this.size,
      2 * this.size
    );
  };
}


