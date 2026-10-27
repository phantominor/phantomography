// scripts/weekly-period.mjs
// 算出一期醫學周報的期別與涵蓋期間（一律用台北時間，雲端排程的主機是 UTC，不能用主機的本地時間）。
//
//   node scripts/weekly-period.mjs               上一個完整週（週一到週日）：週一早上跑就是剛結束的那一週
//   node scripts/weekly-period.mjs 2026-10-21    指定日期所在的那一週
//
// 輸出 JSON：{ issue: "2026-W43", year, week, start: "2026-10-19", end: "2026-10-25", date: 今天, file: "content/weekly/2026/2026-w43.md", title }
// 期別是 ISO 週（週一開始；跨年時依該週的週四所在年份）。

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

// 台北時間的「今天」，存成 UTC 午夜的 Date，之後只做 UTC 的日期運算，不受主機時區影響
function taipeiToday() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
}

function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new Error(`日期格式要是 YYYY-MM-DD：${s}`);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const mondayOf = (d) => addDays(d, -((d.getUTCDay() + 6) % 7));

function isoWeek(monday) {
  const thursday = addDays(monday, 3);
  const year = thursday.getUTCFullYear();
  const firstThursday = mondayOf(new Date(Date.UTC(year, 0, 4)));
  return { year, week: Math.round((mondayOf(thursday) - firstThursday) / (7 * 86400000)) + 1 };
}

const today = taipeiToday();
const arg = process.argv[2];
const monday = arg ? mondayOf(parseDate(arg)) : addDays(mondayOf(today), -7);
const { year, week } = isoWeek(monday);
const issue = `${year}-W${pad(week)}`;

console.log(JSON.stringify({
  issue,
  year,
  week,
  start: ymd(monday),
  end: ymd(addDays(monday, 6)),
  date: ymd(today),
  file: `content/weekly/${year}/${year}-w${pad(week)}.md`,
  title: `醫學周報 ${year} 年第 ${week} 週`,
}, null, 2));
