
import { ELEMENT_ERASE_THRESHOLD } from "../constants";

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  return Math.abs(distToStart + distToEnd - distLine) < ELEMENT_ERASE_THRESHOLD;
};

export const isNearPoint = (x, y, x1, y1) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5;
};

export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export default function arrowCoordinate(x1,y1,x2,y2,arrowLen){
    let angle=Math.atan2((y2-y1),(x2-x1));

    //3rd as pointing array towards left
    let x3=x2-arrowLen*Math.cos(angle-Math.PI/6); // let angle between  3rd and line(between 1 and 2 ) be 30(pi/6)
    let y3=y2-arrowLen*Math.sin(angle-Math.PI/6);

     let x4=x2-arrowLen*Math.cos(angle+ Math.PI/6); 
    let y4=y2-arrowLen*Math.sin(angle+  Math.PI/6);

    return ({
        x3,y3,x4,y4
    });
}