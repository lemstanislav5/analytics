import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { saveImg } from '../../utilities/utilities';

export const Convas = (props) => {
  const { points, arrows, options, widthHeightConvas, setMouseDown } = props;
  const { arrowColor, colorSender, colorsReceiver, pointSize, fontSize } =
    options;
  const convasRef = useRef(null);
  const drawPoints = (cards, ctx) => {
    const drawNumCard = (text, color, x0, y0, x1, y1) => {
      const direction = x0 > x1 ? -1 : 1;
      const midpoint = () => {
        const cutLength = (a, b) =>
          Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);
        const length =
          cutLength({ x: x0, y: y0 }, { x: x1, y: y1 }) +
          ctx.measureText(text).width / 1.5;
        return { length };
      };

      const { length } = midpoint(x0, y0, x1, y1);
      const angel = Math.round(
        Math.atan((y1 - y0) / (x1 - x0)) * (180 / Math.PI)
      );
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = fontSize;
      const tw = (ctx.measureText(text).width / 100) * 50;
      ctx.translate(x0, y0);
      ctx.rotate((angel * Math.PI) / 180);
      ctx.fillText(text, direction * length - tw, 6);
      ctx.restore();
    };
    const rotateFn = (text, color, txtX, txtY) => {
      const width = ctx.canvas.attributes.style.nodeValue.split(';')[0].split(':')[1]
      const centerXY = parseInt(width, 10) / 2;
      drawNumCard(text, color, centerXY, centerXY, txtX, txtY);
    };
    const canvasPoint = (x, y, color, label) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = `bold ${fontSize}px sans-serif`;
      rotateFn(label, color, x, y);
      ctx.stroke();
    };

    const draw = () => {
      // eslint-disable-next-line guard-for-in
      for (const label in cards) {
        const x = cards[label].point[0];
        const y = cards[label].point[1];
        const color =
          cards[label].recipientLength === 0 ? colorsReceiver : colorSender;
        canvasPoint(x, y, color, label);
        // eslint-disable-next-line no-plusplus
      }
    };

    draw();
  };

  const drawArrow = (arrows, points, ctx) => {
    const canvasArrow = (fromx, fromy, tox, toy, color) => {
      const headlen = 6;
      const dx = tox - fromx;
      const dy = toy - fromy;
      const angle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(fromx, fromy);
      ctx.lineTo(tox, toy);
      ctx.lineTo(
        tox - headlen * Math.cos(angle - Math.PI / 6),
        toy - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(tox, toy);
      ctx.lineTo(
        tox - headlen * Math.cos(angle + Math.PI / 6),
        toy - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    };

    const arrowDirection = (x1, y1, x2, y2) => {
      const cutLength = (a, b) =>
        Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2) - 7;
      const expectedDistance = cutLength({ x: x1, y: y1 }, { x: x2, y: y2 });
      // находим длину исходного отрезка
      const dx = x2 - x1;
      const dy = y2 - y1;
      const l = Math.sqrt(dx * dx + dy * dy);
      // находим направляющий вектор
      let dirX = dx / l;
      let dirY = dy / l;
      // умножаем направляющий вектор на необх длину
      dirX *= expectedDistance;
      dirY *= expectedDistance;
      // находим точку
      const resX = dirX + x1;
      const resY = dirY + y1;
      return { resX, resY };
    };
    const drawSum = (text, x0, y0, x1, y1) => {
      const direction = x0 > x1 ? -1 : 1;
      const midpoint = () => {
        const cutLength = (a, b) =>
          Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);
        const length = cutLength({ x: x0, y: y0 }, { x: x1, y: y1 }) / 2;
        return { length };
      };

      const { length } = midpoint(x0, y0, x1, y1);
      const angel = Math.round(
        Math.atan((y1 - y0) / (x1 - x0)) * (180 / Math.PI)
      );
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.font = `${fontSize}px sans-serif`;
      const tw = (ctx.measureText(text).width / 100) * 50;
      ctx.translate(x0, y0);
      ctx.rotate((angel * Math.PI) / 180);
      ctx.fillText(text, direction * length - tw, -6);
      ctx.restore();
    };
    const draw = () => {
      arrows.forEach((item) => {
        const x1 = points[item.from].point[0];
        const y1 = points[item.from].point[1];
        const x2 = points[item.to].point[0];
        const y2 = points[item.to].point[1];
        const a = arrowDirection(x1, y1, x2, y2); // сокращаем отрезок с одной и с другой стороны
        const b = arrowDirection(x2, y2, x1, y1);
        if (item.twoForked === true) {
          canvasArrow(b.resX, b.resY, a.resX, a.resY, arrowColor);
          canvasArrow(a.resX, a.resY, b.resX, b.resY, arrowColor);
        } else {
          canvasArrow(b.resX, b.resY, a.resX, a.resY, arrowColor);
        }
        drawSum(item.sum, x1, y1, x2, y2);
      });
    };
    draw();
  };
  const [state, setState] = useState({ mouseDownCoord: [] });
  useEffect(() => {
    const PIXEL_RATIO = () => {
      const convas = document.createElement("canvas").getContext("2d"),
          dpr = window.devicePixelRatio || 1,
          bsr = convas.webkitBackingStorePixelRatio ||
                convas.mozBackingStorePixelRatio ||
                convas.msBackingStorePixelRatio ||
                convas.oBackingStorePixelRatio ||
                convas.backingStorePixelRatio || 1;
  
      return dpr / bsr;
    };
    
    const createHiDPICanvas = (w, h, ratio) => {
      if (!ratio) { ratio = PIXEL_RATIO(); }
      const can = convasRef.current;
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";
      can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      return can;
    };
  
    const ctx = createHiDPICanvas(widthHeightConvas, widthHeightConvas).getContext("2d");
    ctx.clearRect(0, 0, convasRef.current.width, convasRef.current.height);
    ctx.rect(0, 0, widthHeightConvas, widthHeightConvas);
    ctx.fillStyle = '#fff';
    ctx.fill();
    drawPoints(points, ctx);
    drawArrow(arrows, points, ctx);
  });
  const mouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    setState({ mouseDownCoord: [e.clientX - rect.left, e.clientY - rect.top] });
  };
  const mouseUp = (e) => {
    const rect = e.target.getBoundingClientRect();
    const mouseUpCoord = [e.clientX - rect.left, e.clientY - rect.top];
    const arr = [mouseUpCoord[0], mouseUpCoord[1]];
    const x1 = state.mouseDownCoord[0];
    const y1 = state.mouseDownCoord[1];
    for (const card in points) {
      const [x2, y2] = points[card].point;
      const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
      if (dist < pointSize) {
        setMouseDown(card, arr);
      }
    }
  };
  return (
    <div className="overflow-auto">
      <Row className="d-flex align-items-end flex-row">
        <Col xs="auto" className="my-1">
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              saveImg(convasRef.current);
            }}
          >
            Сохранить
          </Button>
        </Col>
      </Row>
      <canvas
        ref={convasRef}
        width={widthHeightConvas}
        height={widthHeightConvas}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
      />
    </div>
  );
};
Convas.propTypes = {
  options: PropTypes.object,
  points: PropTypes.array,
  arrows: PropTypes.array,
  fontSize: PropTypes.string,
  pointSize: PropTypes.string,
  colorSender: PropTypes.string,
  colorsReceiver: PropTypes.string,
  widthHeightConvas: PropTypes.number,
  setMouseDown: PropTypes.func,
};
Convas.defaultProps = {
  options: {},
  points: [],
  arrows: [],
  fontSize: '',
  pointSize: '',
  colorSender: '',
  colorsReceiver: '',
  widthHeightConvas: 0,
  setMouseDown: () => {},
};
