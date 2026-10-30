// lib/markdown/icons.js
// 渲染 Markdown 時用到的 Lucide 圖示，建置時轉成 SVG 字串直接嵌進 HTML

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  LuTarget, LuLightbulb, LuColumns2, LuTriangleAlert, LuCircleHelp,
  LuBookmark, LuChevronRight, LuLink, LuWorkflow, LuCornerUpLeft,
  LuStethoscope, LuMessageCircleQuestion, LuMicroscope, LuPill, LuHand, LuCompass, LuSiren, LuFolderOpen,
  LuDna, LuHospital, LuNotebookPen, LuNewspaper, LuSparkles, LuExternalLink, LuEye,
} from 'react-icons/lu';

const svg = (Icon) => renderToStaticMarkup(createElement(Icon, { 'aria-hidden': true, className: 'icon' }));

export const ICONS = {
  exam: svg(LuTarget),
  mnemonic: svg(LuLightbulb),
  compare: svg(LuColumns2),
  pitfall: svg(LuTriangleAlert),
  verify: svg(LuCircleHelp),
  supplement: svg(LuSparkles),
  review: svg(LuEye),
  source: svg(LuBookmark),
  detail: svg(LuChevronRight),
  link: svg(LuLink),
  chart: svg(LuWorkflow),
  backlink: svg(LuCornerUpLeft),
  external: svg(LuExternalLink),
};

// 總覽頁卡片的圖示（data/nav.js 的 icon 欄位）
export const CARD_ICONS = {
  stethoscope: svg(LuStethoscope),
  complaint: svg(LuMessageCircleQuestion),
  microscope: svg(LuMicroscope),
  pill: svg(LuPill),
  hand: svg(LuHand),
  compass: svg(LuCompass),
  siren: svg(LuSiren),
  folder: svg(LuFolderOpen),
  dna: svg(LuDna),
  hospital: svg(LuHospital),
  notebook: svg(LuNotebookPen),
  newspaper: svg(LuNewspaper),
};
