// const p5 = require('node-p5');
import { p5 } from 'node-p5'
import { saveCanvas } from "./saveCanvasMemfs.js"
export { start }

function sketch(p) {
    p.setup = () => {
        let canvas = p.createCanvas(1024, 1024);
        setTimeout(() => {
            saveCanvas(canvas, 'myCanvas', 'png');
        }, 100);
    }
    p.draw = () => {
        p.background(255);
        p.fill(0)
        p.circle(p.width / 2, p.height / 2, 400);
    }
}

function start() {
    let p5Instance = p5.createSketch(sketch);
}
