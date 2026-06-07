'use client';

import { useState, useEffect, useRef } from 'react';

// 生成随机点（极坐标分布，半径随机，保证形状像变形虫）
const generateRandomPoints = (numPoints: number, radiusMin: number, radiusMax: number): { x: number; y: number }[] => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const r = radiusMin + Math.random() * (radiusMax - radiusMin);
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
};

// Catmull-Rom 样条辅助：给定 p0,p1,p2,p3，返回从 p1 到 p2 的贝塞尔控制点
function getCatmullRomBezierPoints(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const tension = 0.5; // 标准 Catmull-Rom
  const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
  const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
  const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
  const cp2y = p2.y - (p3.y - p1.y) * tension / 3;
  return [
    { x: cp1x, y: cp1y },
    { x: cp2x, y: cp2y },
  ];
}

// 将点集转换为平滑闭合曲线（使用 C 命令，曲线经过每个点）
const pointsToSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 3) return '';
  const len = points.length;
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < len; i++) {
    const p0 = points[(i - 1 + len) % len];
    const p1 = points[i];
    const p2 = points[(i + 1) % len];
    const p3 = points[(i + 2) % len];
    const [cp1, cp2] = getCatmullRomBezierPoints(p0, p1, p2, p3);
    d += ` C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p2.x},${p2.y}`;
  }
  d += ' Z';
  return d;
};

// 线性插值点集
const lerpPoints = (
  from: { x: number; y: number }[],
  to: { x: number; y: number }[],
  t: number
): { x: number; y: number }[] => {
  return from.map((p, i) => ({
    x: p.x + (to[i].x - p.x) * t,
    y: p.y + (to[i].y - p.y) * t,
  }));
};

export function IconBackground()  {
  const [pathD, setPathD] = useState('');
  const animationRef = useRef<number>(0);
  const startPointsRef = useRef<{ x: number; y: number }[]>([]);
  const endPointsRef = useRef<{ x: number; y: number }[]>([]);
  const progressRef = useRef(0);
  const step = 0.015; // 变形速度（值越小越丝滑）

  // 初始化一组随机点（变形虫基础形状）
  const initRandomPoints = () => {
    // 12个点，半径范围30~50（可调）
    return generateRandomPoints(12, 30, 50);
  };

  const generateNewTarget = () => {
    endPointsRef.current = initRandomPoints();
  };

  const animate = () => {
    if (progressRef.current < 1) {
      const t = easeInOutCubic(progressRef.current);
      const currentPoints = lerpPoints(startPointsRef.current, endPointsRef.current, t);
      setPathD(pointsToSmoothPath(currentPoints));
      progressRef.current += step;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // 完成一次变形，设置最终形态
      setPathD(pointsToSmoothPath(endPointsRef.current));
      // 准备下一轮变形
      startPointsRef.current = [...endPointsRef.current];
      generateNewTarget();
      progressRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const easeInOutCubic = (x: number): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  useEffect(() => {
    startPointsRef.current = initRandomPoints();
    generateNewTarget();
    setPathD(pointsToSmoothPath(startPointsRef.current));
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <svg className="absolute inset-0 sm:top-1 sm:left-0 w-[95%] h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={pathD} fill="url(#grad)" opacity="1" />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2b2b2b" />
          <stop offset="100%" stopColor="#2b2b2b" />
        </linearGradient>
      </defs>
    </svg>
  );
};