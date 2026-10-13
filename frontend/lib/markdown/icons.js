// lib/markdown/icons.js
// 渲染 Markdown 時用到的 Lucide 圖示，建置時轉成 SVG 字串直接嵌進 HTML

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  LuTarget, LuLightbulb, LuColumns2, LuTriangleAlert, LuCircleHelp,
  LuBookmark, LuChevronRight, LuLink,
} from 'react-icons/lu';

const svg = (Icon) => renderToStaticMarkup(createElement(Icon, { 'aria-hidden': true, className: 'icon' }));

export const ICONS = {
  exam: svg(LuTarget),
  mnemonic: svg(LuLightbulb),
  compare: svg(LuColumns2),
  pitfall: svg(LuTriangleAlert),
  verify: svg(LuCircleHelp),
  source: svg(LuBookmark),
  detail: svg(LuChevronRight),
  link: svg(LuLink),
};
