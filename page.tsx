"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type City = {
  id: string;
  name: Record<Language, string>;
  short: Record<Language, string>;
  path: string;
  label: [number, number];
  extra?: { d: string; label?: [number, number] }[];
};

type Language = "zh-CN" | "zh-TW" | "en";

const levels = [
  { name: { "zh-CN": "没去过", "zh-TW": "沒去過", en: "Never" }, score: 0, color: "#f8f8f8" },
  { name: { "zh-CN": "路过", "zh-TW": "路過", en: "Passed" }, score: 1, color: "#3697d7" },
  { name: { "zh-CN": "出差", "zh-TW": "出差", en: "Business" }, score: 2, color: "#32c978" },
  { name: { "zh-CN": "游玩", "zh-TW": "遊玩", en: "Visited" }, score: 3, color: "#f7c51b" },
  { name: { "zh-CN": "短居", "zh-TW": "短居", en: "Stayed" }, score: 4, color: "#d98732" },
  { name: { "zh-CN": "居住", "zh-TW": "居住", en: "Lived" }, score: 5, color: "#f04b3d" },
];

const cities: City[] = [
  { id: "huzhou", name: { "zh-CN": "湖州市", "zh-TW": "湖州市", en: "Huzhou" }, short: { "zh-CN": "湖州", "zh-TW": "湖州", en: "Huzhou" }, path: "M140 80 H270 V160 H240 V190 H140 Z", label: [202, 130] },
  { id: "jiaxing", name: { "zh-CN": "嘉兴市", "zh-TW": "嘉興市", en: "Jiaxing" }, short: { "zh-CN": "嘉兴", "zh-TW": "嘉興", en: "Jiaxing" }, path: "M270 80 H390 V190 H240 V160 H270 Z", label: [326, 132] },
  { id: "hangzhou", name: { "zh-CN": "杭州市", "zh-TW": "杭州市", en: "Hangzhou" }, short: { "zh-CN": "杭州", "zh-TW": "杭州", en: "Hangzhou" }, path: "M90 190 H240 V340 H120 V300 H90 Z", label: [173, 258] },
  { id: "shaoxing", name: { "zh-CN": "绍兴市", "zh-TW": "紹興市", en: "Shaoxing" }, short: { "zh-CN": "绍兴", "zh-TW": "紹興", en: "Shaoxing" }, path: "M240 190 H390 V310 H360 V340 H240 Z", label: [315, 258] },
  { id: "ningbo", name: { "zh-CN": "宁波市", "zh-TW": "寧波市", en: "Ningbo" }, short: { "zh-CN": "宁波", "zh-TW": "寧波", en: "Ningbo" }, path: "M390 200 H510 V330 H460 V360 H360 V310 H390 Z", label: [443, 265] },
  {
    id: "zhoushan", name: { "zh-CN": "舟山市", "zh-TW": "舟山市", en: "Zhoushan" }, short: { "zh-CN": "舟山", "zh-TW": "舟山", en: "Zhoushan" },
    path: "M558 155 H630 V215 H558 Z",
    label: [594, 185],
    extra: [
      { d: "M535 125 H560 V145 H535 Z" },
      { d: "M640 178 H660 V198 H640 Z" },
    ],
  },
  { id: "quzhou", name: { "zh-CN": "衢州市", "zh-TW": "衢州市", en: "Quzhou" }, short: { "zh-CN": "衢州", "zh-TW": "衢州", en: "Quzhou" }, path: "M50 300 H120 V340 H190 V470 H160 V480 H50 Z", label: [112, 400] },
  { id: "jinhua", name: { "zh-CN": "金华市", "zh-TW": "金華市", en: "Jinhua" }, short: { "zh-CN": "金华", "zh-TW": "金華", en: "Jinhua" }, path: "M190 340 H360 V470 H190 Z", label: [275, 405] },
  { id: "taizhou", name: { "zh-CN": "台州市", "zh-TW": "台州市", en: "Taizhou" }, short: { "zh-CN": "台州", "zh-TW": "台州", en: "Taizhou" }, path: "M360 360 H470 V375 H490 V470 H360 Z", label: [425, 420] },
  { id: "lishui", name: { "zh-CN": "丽水市", "zh-TW": "麗水市", en: "Lishui" }, short: { "zh-CN": "丽水", "zh-TW": "麗水", en: "Lishui" }, path: "M160 470 H360 V640 H320 V660 H180 V620 H160 Z", label: [265, 555] },
  { id: "wenzhou", name: { "zh-CN": "温州市", "zh-TW": "溫州市", en: "Wenzhou" }, short: { "zh-CN": "温州", "zh-TW": "溫州", en: "Wenzhou" }, path: "M360 470 H490 V590 H460 V620 H360 Z", label: [423, 545] },
];

const copy = {
  "zh-CN": {
    title: "浙江制霸地图", posterTitle: "浙江制霸", subtitle: "点亮你在浙江走过的地方，看看你的制霸分数。",
    reset: "重置", export: "输出图片", footprints: "我的足迹", score: "分数", select: "选择足迹",
    hint: "点击城市名称，选择你与这座城市的故事。", tip: "你的选择会自动保存在这台设备上。",
    note: "折线浙江 · 点击城市切换足迹状态", bay: "杭州湾", points: "分", language: "语言",
  },
  "zh-TW": {
    title: "浙江制霸地圖", posterTitle: "浙江制霸", subtitle: "點亮你在浙江走過的地方，看看你的制霸分數。",
    reset: "重設", export: "輸出圖片", footprints: "我的足跡", score: "分數", select: "選擇足跡",
    hint: "點擊城市名稱，選擇你與這座城市的故事。", tip: "你的選擇會自動儲存在這台裝置上。",
    note: "折線浙江 · 點擊城市切換足跡狀態", bay: "杭州灣", points: "分", language: "語言",
  },
  en: {
    title: "Zhejiang Conquest Map", posterTitle: "ZHEJIANG CONQUEST", subtitle: "Light up the places you have been and see your Zhejiang score.",
    reset: "Reset", export: "Export Image", footprints: "My Footprints", score: "Score", select: "Choose Footprints",
    hint: "Choose a city and set the story of your visit.", tip: "Your choices are saved automatically on this device.",
    note: "Zhejiang Grid · Click a city to change its status", bay: "Hangzhou Bay", points: "pts", language: "Language",
  },
} satisfies Record<Language, Record<string, string>>;

const initialState = Object.fromEntries(cities.map((city) => [city.id, 0]));

export default function Home() {
  const [status, setStatus] = useState<Record<string, number>>(initialState);
  const [active, setActive] = useState("hangzhou");
  const [language, setLanguage] = useState<Language>("zh-CN");
  const svgRef = useRef<SVGSVGElement>(null);
  const t = copy[language];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zhejiang-domination-map");
      if (saved) setStatus({ ...initialState, ...JSON.parse(saved) });
      const savedLanguage = localStorage.getItem("zhejiang-domination-language") as Language | null;
      if (savedLanguage && savedLanguage in copy) setLanguage(savedLanguage);
    } catch {
      // Keep the clean default if browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("zhejiang-domination-map", JSON.stringify(status));
    } catch {
      // The map remains fully usable without persistence.
    }
  }, [status]);

  useEffect(() => {
    localStorage.setItem("zhejiang-domination-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const score = useMemo(
    () => Object.values(status).reduce((sum, value) => sum + value, 0),
    [status],
  );

  const setLevel = (id: string, level: number) => {
    setActive(id);
    setStatus((current) => ({ ...current, [id]: level }));
  };

  const cycle = (id: string) => setLevel(id, ((status[id] ?? 0) + 1) % levels.length);

  const download = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "1400");
    clone.setAttribute("height", "1750");
    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1400;
      canvas.height = 1750;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `${t.posterTitle}-${score}${language === "en" ? "pts" : "分"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    image.src = url;
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ZHEJIANG CONQUEST MAP</p>
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>
        <div className="header-actions">
          <label className="language-picker">
            <span>{t.language}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </label>
          <button className="secondary-button" onClick={() => setStatus(initialState)}>
            ↺ {t.reset}
          </button>
          <button className="primary-button" onClick={download}>
            ↓ {t.export}
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="poster-card">
          <svg
            ref={svgRef}
            className="poster"
            viewBox="0 0 700 875"
            role="img"
            aria-label={`${t.title}, ${t.score} ${score}`}
          >
            <rect width="700" height="875" fill="#92b9ef" />
            <style>{`
              .poster-title{font-family:"Microsoft YaHei","SimHei","Noto Sans SC",Arial,sans-serif;font-size:48px;font-weight:900;letter-spacing:1px;fill:#050505}
              .poster-title-en{font-size:31px;letter-spacing:1px}
              .poster-kicker{font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;fill:#050505;opacity:.62}
              .city path{stroke:#262626;stroke-width:5;stroke-linejoin:miter;fill-rule:evenodd}
              .city text{font-family:"Microsoft YaHei","SimHei","Noto Sans SC",Arial,sans-serif;font-size:20px;font-weight:800;text-anchor:middle;dominant-baseline:middle;fill:#050505}
              .city .city-label-en{font-size:13px}
              .hangzhou-bay{fill:#bad8f8;stroke:#262626;stroke-width:4;stroke-linejoin:miter}
              .bay-label{font-family:"Microsoft YaHei","SimHei","Noto Sans SC",Arial,sans-serif;font-size:11px;font-weight:800;text-anchor:middle;fill:#31577f}
              .legend rect{stroke:#262626;stroke-width:3}
              .legend text{font-family:"Microsoft YaHei","SimHei","Noto Sans SC",Arial,sans-serif;font-size:18px;font-weight:700;fill:#050505}
              .legend .legend-label-en{font-size:14px}
              .legend-title{font-size:18px!important;font-weight:900!important}
              .score-label{font-family:"Microsoft YaHei","SimHei",Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:2px;fill:#050505}
              .score-number{font-family:"Microsoft YaHei","SimHei",Arial,sans-serif;font-size:76px;font-weight:900;letter-spacing:-3px;fill:#050505}
              .score-max{font-family:"Microsoft YaHei","SimHei",Arial,sans-serif;font-size:23px;font-weight:700;fill:#050505;opacity:.6}
              .poster-note{font-family:"Microsoft YaHei","SimHei",Arial,sans-serif;font-size:14px;font-weight:700;fill:#050505}
              .poster-note-en{font-size:12px}
              .signature{font-family:Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;fill:#050505;opacity:.6}
            `}</style>
            <text x="350" y="66" textAnchor="middle" className={`poster-title ${language === "en" ? "poster-title-en" : ""}`}>{t.posterTitle}</text>
            <g className="map-shape" transform="translate(35 70) scale(.9)">
              {cities.map((city) => (
                <g
                  key={city.id}
                  className={`city ${active === city.id ? "is-active" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${city.name[language]}: ${levels[status[city.id]].name[language]}`}
                  onClick={() => cycle(city.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      cycle(city.id);
                    }
                  }}
                >
                  <path d={city.path} fill={levels[status[city.id]].color} />
                  {city.extra?.map((piece, index) => (
                    <path key={index} d={piece.d} fill={levels[status[city.id]].color} />
                  ))}
                  <text className={language === "en" ? "city-label-en" : ""} x={city.label[0]} y={city.label[1]}>{city.short[language]}</text>
                </g>
              ))}
              <g pointerEvents="none" aria-label={t.bay}>
                <path
                  className="hangzhou-bay"
                  d="M225 188 H390 V198 H420 V218 H390 V230 H300 V218 H225 Z"
                />
                <text className="bay-label" x="333" y="209">{t.bay}</text>
              </g>
            </g>

            <g transform="translate(548 370) scale(.85)" className="legend">
              <text x="61" y="-18" textAnchor="middle" className="legend-title">{t.footprints}</text>
              {[...levels].reverse().map((level, index) => (
                <g key={level.score} transform={`translate(0 ${index * 45})`}>
                  <rect width="122" height="45" fill={level.color} />
                  <text className={language === "en" ? "legend-label-en" : ""} x="61" y="29" textAnchor="middle">{level.name[language]} {level.score}</text>
                </g>
              ))}
            </g>

            <g transform="translate(56 736)">
              <text className="score-label" x="0" y="0">{t.score}</text>
              <text className="score-number" x="0" y="75">{score}</text>
              <text className="score-max" x={score > 9 ? 112 : 68} y="75">/ 55</text>
              <text className={`poster-note ${language === "en" ? "poster-note-en" : ""}`} x="0" y="112">{t.note}</text>
            </g>
            <text x="56" y="868" className="signature">lch262</text>
            <text x="644" y="826" textAnchor="end" className="signature">浙江 · 11 CITY</text>
          </svg>
        </div>

        <aside className="control-panel">
          <div className="panel-heading">
            <div>
              <span className="step">01</span>
              <h2>{t.select}</h2>
            </div>
            <span className="score-pill">{score} {t.points}</span>
          </div>
          <p className="panel-hint">{t.hint}</p>
          <div className="city-list">
            {cities.map((city) => (
              <div className={`city-row ${active === city.id ? "selected" : ""}`} key={city.id}>
                <button className="city-name" onClick={() => cycle(city.id)}>
                  <span className="dot" style={{ background: levels[status[city.id]].color }} />
                  {city.name[language]}
                </button>
                <select
                  aria-label={`${city.name[language]} ${t.footprints}`}
                  value={status[city.id]}
                  onChange={(event) => setLevel(city.id, Number(event.target.value))}
                >
                  {levels.map((level) => (
                    <option key={level.score} value={level.score}>{level.name[language]}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="tip">
            <span>TIP</span>
            {t.tip}
          </div>
        </aside>
      </section>
    </main>
  );
}
