import { useEffect, useRef, useState } from "react";
import styles from "./NotFound.module.css";

type Obstacle = { x: number; w: number; h: number };
type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  hue: number;
};

export function NotFound() {
  const matrixRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const metersRef = useRef<HTMLSpanElement>(null);
  const unlocked = useRef(false);
  const [over, setOver] = useState(false);
  const [deal, setDeal] = useState(false);
  const [hint, setHint] = useState("ПРОБЕЛ / КЛИК — ПРЫЖОК");

  useEffect(() => {
    const canvas = matrixRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glyphs = "01olzi404";
    const fontSize = 16;
    let drops: number[] = [];
    let raf = 0;
    let acc = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      acc += 1;
      if (acc % 5 !== 0) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Roboto Mono", monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle =
          Math.random() > 0.94
            ? "rgba(255, 72, 146, 0.45)"
            : "rgba(255, 72, 146, 0.1)";
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) {
          drops[i] = 0;
        } else {
          drops[i] += 0.35;
        }
      }
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const canvas = gameRef.current;
    const fx = fxRef.current;
    const meter = metersRef.current;
    if (!canvas || !fx || !meter) return;

    const ctx = canvas.getContext("2d");
    const fxCtx = fx.getContext("2d");
    if (!ctx || !fxCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let dead = false;
    let distance = 0;
    let speed = 7;
    let spawn = 110;
    let ground = 0;
    let laneL = 0;
    let laneR = 0;
    let scroll = 0;
    const player = { x: 0, y: 0, vy: 0, size: 42, onGround: true };
    let obstacles: Obstacle[] = [];
    let shards: Shard[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fx.width = window.innerWidth;
      fx.height = window.innerHeight;
      const inset = Math.max(56, canvas.width * 0.2);
      laneL = inset;
      laneR = canvas.width - inset;
      ground = canvas.height * 0.58;
      player.x = laneL + 18;
      if (player.onGround) player.y = ground - player.size;
    };

    const burst = () => {
      shards = Array.from({ length: 140 }, () => ({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.22,
        vx: (Math.random() - 0.5) * 16,
        vy: -5 - Math.random() * 13,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.36,
        w: 5 + Math.random() * 16,
        h: 2 + Math.random() * 6,
        hue: [320, 190, 48, 280, 160][Math.floor(Math.random() * 5)],
      }));
    };

    const reset = () => {
      running = false;
      dead = false;
      distance = 0;
      speed = 7;
      spawn = 110;
      scroll = 0;
      player.vy = 0;
      player.onGround = true;
      player.y = ground - player.size;
      obstacles = [];
      if (!unlocked.current) shards = [];
      setOver(false);
      setHint("ПРОБЕЛ / КЛИК — ПРЫЖОК");
      meter.textContent = "0000 м";
    };

    const jump = () => {
      if (dead) {
        reset();
        return;
      }
      if (!running) {
        running = true;
        setHint("");
      }
      if (player.onGround) {
        player.vy = -15.2;
        player.onGround = false;
      }
    };

    const drawHeart = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      const s = size / 44;
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(22, 38.7);
      ctx.lineTo(3.5, 21.1);
      ctx.lineTo(3.5, 12.3);
      ctx.lineTo(9.7, 6.2);
      ctx.lineTo(16.7, 6.2);
      ctx.lineTo(22, 12.3);
      ctx.lineTo(27.3, 6.2);
      ctx.lineTo(34.3, 6.2);
      ctx.lineTo(40.5, 12.3);
      ctx.lineTo(40.5, 21.1);
      ctx.closePath();
      ctx.fillStyle = "#ff4892";
      ctx.shadowColor = "rgba(255, 72, 146, 0.7)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    };

    const hit = (ob: Obstacle) => {
      const px = player.x + 8;
      const py = player.y + 10;
      const pw = player.size - 14;
      const ph = player.size - 12;
      return (
        px < ob.x + ob.w &&
        px + pw > ob.x &&
        py + ph > ground - ob.h &&
        py < ground
      );
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      scroll += running && !dead ? speed : 0.6;

      const lane = ctx.createLinearGradient(laneL, 0, laneR, 0);
      lane.addColorStop(0, "rgba(255, 72, 146, 0)");
      lane.addColorStop(0.035, "rgba(255, 72, 146, 0.4)");
      lane.addColorStop(0.965, "rgba(255, 72, 146, 0.4)");
      lane.addColorStop(1, "rgba(255, 72, 146, 0)");
      ctx.strokeStyle = lane;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(laneL, ground);
      ctx.lineTo(laneR, ground);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.rect(laneL, ground, laneR - laneL, 8);
      ctx.clip();
      ctx.strokeStyle = "rgba(255, 72, 146, 0.18)";
      for (let x = laneL - ((scroll * 0.8) % 48); x < laneR; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, ground + 1);
        ctx.lineTo(x + 18, ground + 1);
        ctx.stroke();
      }
      ctx.restore();

      if (running && !dead) {
        player.vy += 0.68;
        player.y += player.vy;
        if (player.y >= ground - player.size) {
          player.y = ground - player.size;
          player.vy = 0;
          player.onGround = true;
        }

        spawn -= 1;
        if (spawn <= 0) {
          obstacles.push({
            x: laneR + 8,
            w: 10 + Math.random() * 8,
            h: 26 + Math.random() * 32,
          });
          spawn = 64 + Math.random() * 80 - Math.min(28, speed * 1.6);
        }

        speed += 0.002;
        distance += speed * 0.09;
        meter.textContent = `${String(Math.floor(distance)).padStart(4, "0")} м`;

        if (!unlocked.current && distance >= 1000) {
          unlocked.current = true;
          burst();
          setDeal(true);
        }

        obstacles.forEach((ob) => {
          ob.x -= speed;
        });
        obstacles = obstacles.filter((ob) => ob.x + ob.w > laneL - 8);

        for (const ob of obstacles) {
          if (hit(ob)) {
            dead = true;
            running = false;
            setOver(true);
            setHint("КЛИК / ПРОБЕЛ — ЕЩЁ РАЗ");
            break;
          }
        }
      } else if (!dead) {
        player.y = ground - player.size + Math.sin(performance.now() / 320) * 2;
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(laneL - 2, 0, laneR - laneL + 4, canvas.height);
      ctx.clip();
      obstacles.forEach((ob) => {
        ctx.strokeStyle = "#ff4892";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ob.x + 0.5, ground - ob.h + 0.5, ob.w, ob.h);
        ctx.fillStyle = "rgba(255, 72, 146, 0.12)";
        ctx.fillRect(ob.x, ground - ob.h, ob.w, ob.h);
      });
      drawHeart(player.x, player.y, player.size);
      ctx.restore();

      fxCtx.clearRect(0, 0, fx.width, fx.height);
      shards.forEach((s) => {
        s.vy += 0.18;
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.vr;
        fxCtx.save();
        fxCtx.translate(s.x, s.y);
        fxCtx.rotate(s.rot);
        const g = fxCtx.createLinearGradient(-s.w, 0, s.w, s.h);
        g.addColorStop(0, `hsla(${s.hue}, 95%, 68%, 0.95)`);
        g.addColorStop(0.45, "rgba(255,255,255,0.95)");
        g.addColorStop(1, `hsla(${(s.hue + 160) % 360}, 90%, 62%, 0.88)`);
        fxCtx.fillStyle = g;
        fxCtx.beginPath();
        fxCtx.moveTo(0, -s.h);
        fxCtx.lineTo(s.w / 2, 0);
        fxCtx.lineTo(0, s.h);
        fxCtx.lineTo(-s.w / 2, 0);
        fxCtx.closePath();
        fxCtx.fill();
        fxCtx.restore();
        s.hue += 3.4;
      });
      shards = shards.filter((s) => s.y < fx.height + 40);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      e.preventDefault();
      jump();
    };

    const onPointer = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a")) return;
      e.preventDefault();
      jump();
    };

    resize();
    reset();
    if (!reduced) tick();
    else meter.textContent = "0000 м";

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className={styles.page} aria-label="404">
      <canvas className={styles.matrix} ref={matrixRef} aria-hidden="true" />
      <canvas
        className={styles.game}
        ref={gameRef}
        aria-label="Игра: прыгай через препятствия"
      />
      <canvas className={styles.fx} ref={fxRef} aria-hidden="true" />

      <p className={styles.ghost} aria-hidden="true">
        404
      </p>

      <header className={styles.hud}>
        <span>SEMENOVA</span>
        <span className={styles.mark} aria-hidden="true" />
        <span ref={metersRef}>0000 м</span>
      </header>

      <div className={styles.copy}>
        <p className={styles.code}>404 // ФАЙЛ НЕ НАЙДЕН</p>
        <p className={styles.sub}>Сигнал потерян</p>
      </div>

      {over ? (
        <p className={styles.fail} aria-live="polite">
          СИГНАЛ ОБОРВАН
        </p>
      ) : null}

      {deal ? (
        <aside className={styles.deal}>
          <p className={styles.dealTitle}>Вам доступна скидка 10%</p>
          <p className={styles.dealCode}>OLZI10</p>
        </aside>
      ) : null}

      <p className={styles.hint}>{hint}</p>
      <a className={styles.back} href="/">
        НА ГЛАВНУЮ
      </a>
    </main>
  );
}
