import React, { Component } from 'react';
import styled from 'styled-components';
import PARTICLE from './particle';
import imgSrc from './test.png';

const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 50px);
  position: absolute;
  top: 50px;
  display: block;
  visibility: ${props => props.visibility};
`;

const color1 = `#00b7ffcc`;
const color2 = 'red';
const Actions = [
  { lifeTime: 60, texts: [{ text: 3, color: color1 }] },
  { lifeTime: 60, texts: [{ text: 2, color: color1 }] },
  { lifeTime: 60, texts: [{ text: 1, color: color1 }] },
  {
    lifeTime: 120,
    texts: [
      { text: 'I', color: color1 },
      { text: '❤', color: color2 },
      { text: 'Y', color: color1 },
      { text: 'O', color: color1 },
      { text: 'U', color: color1 }
    ]
  }
];

class ImgFrag {
  constructor(img, targetPosX, targetPosY, x, y, nx, ny) {
    this.img = img; // 要绘制的图片点
    this.x = x; // 当前图片点在canvas中的x坐标
    this.y = y; // 当前图片点在canvas中的y坐标
    this.targetPosX = targetPosX; // 图片点在目标位置x
    this.targetPosY = targetPosY; // 图片点在目标位置y
    this.vx = 0.2; // 图片点x方向速度
    this.vy = 0.2; // 图片点在y方向的速度
    this.nx = nx; // 图片下落的时候x方向的速度
    this.ny = ny; // 图片下落时候y方向的速度
  }
}
class ImgParicle {
  constructor(targetPosX = 450, targetPosY = 50, canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasW = this.canvas.clientWidth; // canvas 的宽
    this.canvasH = this.canvas.clientHeight; // canvas 的高
    this.imgW = 500; // 图片的宽
    this.imgH = 503; // 图片的高
    this.density = 1; // 每次取得像素密度
    this.targetPosX = targetPosX; // 图片想要绘制在canvas中的位置X
    this.targetPosY = targetPosY; // 图片想要绘制在canvas中的位置Y
    this.fragList = []; // 存放每一个图片点的数组
    this.counter = 1; // 用来限制那些图片点可以运动
    this.isDown = false; // 图片是否已经落下
    this.drawTimes = 0;
    this.init();
  }

  // 初始化
  init() {
    const img = new Image();

    img.onload = () => {
      this.imgW = img.width;
      this.imgH = img.height;

      const fragmentSize = 20;
      this.rows = Math.ceil(this.imgH / fragmentSize);
      this.cols = Math.ceil(this.imgW / fragmentSize);

      this.ctx.drawImage(img, 0, 0, this.imgW, this.imgH);

      for (let i = 0; i < this.rows; i++) {
        this.fragList[i] = [];
        for (let j = 0; j < this.cols; j++) {
          const fragImg = this.ctx.getImageData(
            j * fragmentSize,
            i * fragmentSize,
            fragmentSize,
            fragmentSize
          ); // 图片片段
          const targetPosX = j * fragmentSize + this.targetPosX; // 目标x位置
          const targetPosY = i * fragmentSize + this.targetPosY; // 目标y位置
          const x = Math.random() * this.canvasW; // 随机到canvas中x位置
          const y = Math.random() * this.canvasH; // 随机到canvas中y位置
          const nx = 0;
          const ny = 0;
          const frmg = new ImgFrag(
            fragImg,
            targetPosX,
            targetPosY,
            x,
            y,
            nx,
            ny
          );
          this.fragList[i][j] = frmg;
        }
      }

      this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
      this.draw();
    };
    img.src = imgSrc;
  }

  // 绘制图片
  draw = () => {
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    this.drawTimes++;
    if (this.counter < this.imgH) this.counter++;
    if (!this.isDown) {
      for (let i = 0; i < this.rows; i += 1) {
        for (let j = 0; j < this.cols; j += 1) {
          const frag = this.fragList[i][j];
          if (i < this.counter) {
            const tx = frag.targetPosX;
            const ty = frag.targetPosY;
            const x = frag.x;
            const y = frag.y;
            const dx = tx - x;
            const dy = ty - y;
            if (Math.abs(dx) < 0.5) {
              frag.x = tx;
            } else {
              frag.x += dx * frag.vx * Math.random() * 1.5;
            }
            if (Math.abs(dy) < 0.5) {
              frag.y = ty;
            } else {
              frag.y += dy * frag.vy * Math.random() * 1.5;
            }
          }

          this.ctx.putImageData(frag.img, frag.x, frag.y);
        }
      }
    } else {
      for (let i = 0; i < this.rows; i += 1) {
        for (let j = 0; j < this.cols; j += 1) {
          const frag = this.fragList[i][j];
          const ty = this.canvasH - 20;
          frag.x += frag.nx;
          frag.y += frag.ny;
          if (frag.y >= ty) {
            frag.y = ty;
            frag.ny *= -Math.random() * 0.5;
            if (Math.abs(frag.ny) <= 1) {
              frag.ny = 0;
            }
            if (Math.abs(frag.ny) <= 1) frag.nx = 0;
          } else {
            frag.ny += 1;
          }

          this.ctx.putImageData(frag.img, frag.x, frag.y);
        }
      }
    }
    if (this.drawTimes < 200) {
      requestAnimationFrame(this.draw);
    }
  };

  down() {
    this.isDown = !this.isDown;
    this.drawTimes = 0;
    this.draw();
    if (this.isDown) {
      for (let i = 0; i < this.rows; i += 1) {
        for (let j = 0; j < this.cols; j += 1) {
          const frag = this.fragList[i][j];
          frag.nx = (Math.random() - Math.random()) * 5;
          frag.ny = -Math.random() * 10;
        }
      }
    }

    this.counter = 1;
  }
}

class App extends Component {
  constructor() {
    super();
    this.tick = 0;
    this.actionsIndex = 0;
    this.drawTimes = 0;
    this.geometrys = [];
  }

  componentDidMount() {
    this.start();
    // this.imgParicle = new ImgParicle(0, 0, this.canvas);
  }

  handleClick = () => {
    if (this.imgParicle) {
      this.imgParicle.down();
    }
  };

  start = () => {
    const offscreenCanvas = this.createOffScreenCanvas();
    this.getTextsData(offscreenCanvas);
    this.draw();
  };

  createOffScreenCanvas = () => {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    return this.offscreenCanvas;
  };

  getTextsData = offscreenCanvas => {
    const offscreenCanvasCtx = offscreenCanvas.getContext('2d');
    const width = offscreenCanvas.width;
    const height = offscreenCanvas.height;
    Actions.forEach(({ texts }) => {
      const str = this.composeText(texts);
      const position = this.calcTextsPosition(offscreenCanvas, str);
      let left = position.left;
      const geometry = [];
      texts.forEach(({ text, color }) => {
        offscreenCanvasCtx.clearRect(0, 0, width, height);
        offscreenCanvasCtx.fillText(text, left, position.bottom);
        left += offscreenCanvasCtx.measureText(text).width;
        const data = offscreenCanvasCtx.getImageData(0, 0, width, height);
        const points = this.getTargetPoints(data);
        geometry.push({ color, points });
      });

      this.geometrys.push(geometry);
    });
  };

  composeText = textArr => {
    const composeStr = (str, item) => `${str}${item.text}`;
    const str = textArr.reduce(composeStr, '');
    return str;
  };

  calcTextsPosition = (offscreenCanvas, texts) => {
    const width = offscreenCanvas.width;
    const height = offscreenCanvas.height;
    const offscreenCanvasCtx = offscreenCanvas.getContext('2d');

    // caculate font size
    offscreenCanvasCtx.font = 'bold 10px Arial';
    const measure = offscreenCanvasCtx.measureText(texts);
    const textHeightRatio = 0.8;
    const lineHeight = 7; // 10px字体行高 lineHeight=7px
    const finalSize = Math.min(
      (height * textHeightRatio * 10) / lineHeight,
      (width * textHeightRatio * 10) / measure.width
    );
    offscreenCanvasCtx.font = `bold ${finalSize}px Arial`;

    // caculate resized texts position of canvas center
    const measureResize = offscreenCanvasCtx.measureText(texts);
    const left = (width - measureResize.width) / 2;
    const bottom = (height + (finalSize / 10) * lineHeight) / 2;
    return { left, bottom };
  };

  getTargetPoints = (data, intervel = 4) => {
    const points = [];
    const rows = data.height;
    const cols = data.width;

    for (let i = 0; i < rows; i += intervel) {
      // 按行储存
      for (let j = 0; j < cols; j += intervel) {
        const alpha = data.data[(i * cols + j) * 4 + 3];
        if (alpha) {
          // j行i列对于坐标而言是(x, y)即(列,行)
          const newX = j + (Math.random() - 0.5) * 70 - this.center.x;
          const newY = this.center.y - (i + (Math.random() - 0.5) * 70);
          const pt = {
            x: newX,
            y: newY,
            z: 1
          };
          const particle = new PARTICLE(this.center);
          particle.setAxis(pt);
          points.push(particle);
        }
      }
    }

    // for (let i = 0; i < rows * cols; i += intervel) {
    //   const alpha = data.data[4 * i + 3];
    //   if (alpha) {
    //     const x = i % cols;
    //     const y = Math.floor(i / cols);
    //     points.push({
    //       x: x + (Math.random() - 0.5) * 20,
    //       y: y + (Math.random() - 0.5) * 20,
    //     });
    //   }
    // }
    return points;
  };

  renderParticles = () => {
    const offscreenCanvasCtx = this.offscreenCanvas.getContext('2d');
    const { width, height } = this.canvas;
    const geometry = this.geometrys[this.actionsIndex];
    geometry.forEach(({ color, points }) => {
      offscreenCanvasCtx.fillStyle = color;
      for (let i = 0; i < points.length; i++) {
        const particle = points[i];
        const axis = particle.getAxis2D();
        offscreenCanvasCtx.fillRect(axis.x, axis.y, 2, 2);
      }
    });

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.offscreenCanvas, 0, 0, width, height);
  };

  clear = () => {
    const { width, height } = this.canvas;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const offscreenCanvasCtx = this.offscreenCanvas.getContext('2d');
    offscreenCanvasCtx.clearRect(0, 0, width, height);
  };

  nextAction = () => {
    ++this.actionsIndex;
    this.tick = 0;
    if (this.actionsIndex === Actions.length) {
      window.cancelAnimationFrame(this.raf);
      this.actionsIndex = 0;
      this.geometrys = [];
      // this.start();
      this.imgParicle = new ImgParicle(0, 0, this.canvas);
    }
  };

  draw = () => {
    this.tick++;
    this.clear();
    this.renderParticles();
    this.raf = requestAnimationFrame(this.draw);
    if (this.tick >= Actions[this.actionsIndex].lifeTime) {
      this.nextAction();
    }
  };

  initCanvas = c => {
    this.canvas = c;
    this.canvas.width = c.clientWidth;
    this.canvas.height = c.clientHeight;
    this.center = { x: c.clientWidth / 2, y: c.clientHeight / 2 };
  };

  render() {
    const { visibility } = this.props; //eslint-disable-line
    return (
      <Canvas
        visibility={visibility}
        ref={this.initCanvas}
        onClick={this.handleClick}
      />
    );
  }
}

export default App;
