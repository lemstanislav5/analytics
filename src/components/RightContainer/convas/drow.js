export const drawArrows = (ctx, points, arrows, colorSender, colorsReceiver, pointSize, fontSize) => {
  const lineDirection = (x1, y1, x2, y2, pointSize) => {
    const cutLength = (a, b) =>
      Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2) - pointSize;
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
  const sum = (text, x0, y0, x1, y1) => {
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
  const lineDrow = (from_x, from_y, to_x, to_y, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(from_x, from_y);
    ctx.lineTo(to_x, to_y);
    ctx.stroke();
  };
  arrows.forEach(element => {
    const from = points.find(item => {
      if(item["Пользовательский номер"] === element["from"]){
        return item;
      }
    })
    const to = points.find(item => {
      if(item["Пользовательский номер"] === element["to"]){
        return item;
      }
    })
    const a = lineDirection(from["coord"][0], from["coord"][1], to["coord"][0], to["coord"][1], pointSize); // сокращаем отрезок с одной и с другой стороны
    const b = lineDirection(to["coord"][0], to["coord"][1], from["coord"][0], from["coord"][1], pointSize);
    lineDrow(b.resX, b.resY, a.resX, a.resY, colorSender)
    sum(element["sum"], b.resX, b.resY, a.resX, a.resY)
  });
};

export const drawNumPhone = (ctx, text, color, x0, y0, x1, y1, fontSize) => {
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
export const rotateFn = (ctx, text, color, txtX, txtY, fontSize) => {
  const width = ctx.canvas.attributes.style.nodeValue.split(';')[0].split(':')[1]
  const centerXY = parseInt(width, 10) / 2;
  drawNumPhone(ctx, text, color, centerXY, centerXY, txtX, txtY);
};
export const arc = (ctx, points, colorSender, colorsReceiver, pointSize, fontSize) => {
  points.forEach(element => {
    const color = (element["Собеседник"].length > 0)? colorSender : colorsReceiver;
    const x = element.coord[0], y = element.coord[1];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = `bold ${fontSize}px sans-serif`;
    rotateFn(ctx, element["Пользовательский номер"], color, x, y, fontSize);
    ctx.stroke();
  });
}
