export type ProjectType = "WEB" | "BRAND" | "IDENTITY";

export type Project = {
  id: string;
  title: string;
  type: ProjectType;
  blurb: string;
  href: string;
  accent: string;
  cover: string;
};

export const projects: Project[] = [
  {
    id: "01",
    title: "KillPrice24",
    type: "WEB",
    blurb: "Техника без шума — интернет-магазин с каталогом и корзиной.",
    href: "https://killprice24.olzi-design.online/",
    accent: "#3d9eff",
    cover: "/covers/killprice24.png",
  },
  {
    id: "02",
    title: "AGENT OLGA",
    type: "WEB",
    blurb: "Classified-портфолио: HUD, scroll, живой интерфейс.",
    href: "https://www.behance.net/gallery/247695221/AGENT-OLGA-CLASSIFIED-PORTFOLIO",
    accent: "#ff4892",
    cover: "/covers/agent-olga.png",
  },
  {
    id: "03",
    title: "Penochka",
    type: "BRAND",
    blurb: "More than just coffee — тёплый бренд с характером.",
    href: "https://www.behance.net/gallery/245136675/Penochka-More-Than-Just-Coffee",
    accent: "#e8c39e",
    cover: "/covers/penochka.png",
  },
  {
    id: "04",
    title: "Truffle",
    type: "BRAND",
    blurb: "Coffee & chocolate boutique — вкус, упаковка, характер.",
    href: "https://www.behance.net/gallery/245140833/Truffle-Coffee-Chocolate-Boutique",
    accent: "#c45c26",
    cover: "/covers/truffle.png",
  },
  {
    id: "05",
    title: "Bubbly Axolotl",
    type: "BRAND",
    blurb: "Bubble tea cafe — игривая айдентика и носители.",
    href: "https://www.behance.net/gallery/245139299/Bubbly-Axolotl-Jinju-Bubble-Tea-Cafe",
    accent: "#ff6eb4",
    cover: "/covers/axolotl.png",
  },
  {
    id: "06",
    title: "Einstein School",
    type: "IDENTITY",
    blurb: "Визуальный брендинг образовательной среды.",
    href: "https://www.behance.net/gallery/236787401/Visual-Branding-of-the-Einstein-School",
    accent: "#3d7eff",
    cover: "/covers/einstein.png",
  },
  {
    id: "07",
    title: "GELY KORZHEV",
    type: "IDENTITY",
    blurb: "Monumentalist of the Spirit — editorial identity.",
    href: "https://www.behance.net/gallery/252221409/GELY-KORZHEV-Monumentalist-of-the-Spirit",
    accent: "#d4a017",
    cover: "/covers/korzhev.png",
  },
  {
    id: "08",
    title: "HOME конструктор",
    type: "IDENTITY",
    blurb: "Индустриальный знак: дом внутри буквы, металл, бетон.",
    href: "https://www.behance.net/gallery/236784715/HOME-CONSTRUCTOR-ajdentika",
    accent: "#a8a8a8",
    cover: "/covers/home-constructor.png",
  },
  {
    id: "09",
    title: "HEAVY SILENCE",
    type: "BRAND",
    blurb: "Социальная кампания: когда ребёнок молчит, цепь тяжелее шарика.",
    href: "https://www.behance.net/gallery/245149051/HEAVY-SILENCE",
    accent: "#ff4892",
    cover: "/covers/heavy-silence.png",
  },
  {
    id: "10",
    title: "PORTFOLIO",
    type: "IDENTITY",
    blurb: "Creative presentation — личный бренд и типографика.",
    href: "https://www.behance.net/gallery/235679495/Portfolio",
    accent: "#f3b6c8",
    cover: "/covers/portfolio.png",
  },
  {
    id: "11",
    title: "Pixel Kitty",
    type: "WEB",
    blurb: "Neon cat shelter — промо-сайт с персонажами и живым интерфейсом.",
    href: "https://pixelkitty.olzi-design.online/",
    accent: "#f3b6c8",
    cover: "/covers/pixelkitty.png",
  },
];
