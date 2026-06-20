import {
  AbsoluteFill,
  Sequence,
  Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  random,
} from "remotion";

const FPS = 30;
const BPM = 90;
const BEAT = (FPS * 60) / BPM; // 20 frames / beat

const C = {
  bg: "#05070c",
  red: "#ff2742",
  redDim: "#8f1626",
  redDeep: "#3a0a12",
  text: "#c9d2dc",
  dim: "#6b7686",
  green: "#2ee66f",
  cyan: "#16c8e0",
  amber: "#f0a32a",
  panel: "#0b1018",
  border: "#1b2533",
};
const MONO = "'Cascadia Code','Consolas','DejaVu Sans Mono',monospace";
const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";

const beatPulse = (f: number, off = 0) => {
  const phase = ((f - off) % BEAT) / BEAT;
  return Math.max(0, 1 - Math.max(0, phase) * 3.2);
};
const typed = (text: string, f: number, start: number, cps = 1.6) =>
  text.slice(0, Math.max(0, Math.floor((f - start) * cps)));

const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.28) 3px)",
      opacity: 0.5,
      pointerEvents: "none",
    }}
  />
);
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)",
      pointerEvents: "none",
    }}
  />
);

const BRoll: React.FC<{src: string; opacity?: number; tint?: boolean}> = ({
  src,
  opacity = 0.2,
  tint = true,
}) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile(`broll/${src}.mp4`)}
      muted
      playbackRate={1}
      style={{width: "100%", height: "100%", objectFit: "cover", opacity}}
    />
    {tint && <AbsoluteFill style={{background: "rgba(5,7,12,0.5)"}} />}
  </AbsoluteFill>
);

const Glitch: React.FC<{text: string; size: number; color?: string; jitter?: number}> = ({
  text,
  size,
  color = C.text,
  jitter = 1,
}) => {
  const f = useCurrentFrame();
  const j = beatPulse(f) * jitter;
  const dx = (random(`x${Math.floor(f / 2)}`) - 0.5) * 8 * j;
  return (
    <div style={{position: "relative", fontFamily: MONO, fontWeight: 700, fontSize: size}}>
      <span style={{position: "absolute", left: dx - 3 * j, top: 0, color: C.red, opacity: 0.7}}>{text}</span>
      <span style={{position: "absolute", left: dx + 3 * j, top: 0, color: C.cyan, opacity: 0.55}}>{text}</span>
      <span style={{position: "relative", color, textShadow: `0 0 ${10 + j * 20}px ${C.red}`}}>{text}</span>
    </div>
  );
};

const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 8], [0, 1], {extrapolateRight: "clamp"});
  const sub = interpolate(f, [40, 55], [0, 1], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", gap: 18}}>
      <div style={{opacity: op, transform: `scale(${1 + beatPulse(f) * 0.04})`}}>
        <Glitch text="FLUXION" size={130} jitter={1.4} />
      </div>
      <div style={{opacity: sub, fontFamily: MONO, fontSize: 30, letterSpacing: 10, color: C.red, textTransform: "uppercase"}}>
        Evil Twin Attack
      </div>
      <div style={{opacity: sub * 0.7, fontFamily: MONO, fontSize: 17, color: C.dim, letterSpacing: 2}}>
        // how attackers steal your wi-fi password
      </div>
    </AbsoluteFill>
  );
};

const Row: React.FC<{children: React.ReactNode; show: number; f: number; sel?: boolean}> = ({children, show, f, sel}) => {
  const op = interpolate(f, [show, show + 4], [0, 1], {extrapolateRight: "clamp", extrapolateLeft: "clamp"});
  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${(1 - op) * -20}px)`,
        display: "flex",
        justifyContent: "space-between",
        padding: "9px 16px",
        margin: "5px 0",
        borderRadius: 6,
        border: `1px solid ${sel ? C.red : C.border}`,
        background: sel ? "rgba(255,39,66,0.14)" : "rgba(11,16,24,0.85)",
        boxShadow: sel ? `0 0 24px ${C.redDim}` : "none",
        fontFamily: MONO,
        fontSize: 22,
        color: sel ? C.red : C.text,
      }}
    >
      {children}
    </div>
  );
};

const Bars: React.FC<{n: number}> = ({n}) => (
  <span style={{display: "inline-flex", gap: 3, alignItems: "flex-end"}}>
    {[1, 2, 3, 4].map((i) => (
      <span key={i} style={{width: 5, height: 6 + i * 4, background: i <= n ? C.green : C.border, display: "inline-block"}} />
    ))}
  </span>
);

const Scan: React.FC = () => {
  const f = useCurrentFrame();
  const nets = [
    ["Bell_A4F2", "C8:3A", 4],
    ["VIDEOTRON-5G", "F0:9F", 3],
    ["NETGEAR_Home", "44:1C", 4],
    ["TP-LINK_8821", "A0:2B", 2],
    ["iPhone de Max", "DE:AD", 3],
  ] as const;
  return (
    <AbsoluteFill style={{padding: "70px 220px", justifyContent: "center"}}>
      <div style={{fontFamily: MONO, fontSize: 24, color: C.green, marginBottom: 18}}>
        root@kali:~# {typed("airodump-ng wlan0mon", f, 4)}
        <span style={{opacity: beatPulse(f) > 0.5 ? 1 : 0.2}}>▋</span>
      </div>
      <div style={{fontFamily: MONO, fontSize: 16, color: C.dim, marginBottom: 14}}>
        scanning 2.4GHz / 5GHz · {Math.min(99, Math.floor(interpolate(f, [10, 90], [0, 47])))} APs found
      </div>
      {nets.map((nw, i) => (
        <Row key={nw[0]} show={20 + i * BEAT} f={f}>
          <span>{nw[0]}</span>
          <span style={{color: C.dim}}>{nw[1]}:** </span>
          <Bars n={nw[2]} />
        </Row>
      ))}
    </AbsoluteFill>
  );
};

const TargetLock: React.FC = () => {
  const f = useCurrentFrame();
  const close = spring({frame: f, fps: FPS, config: {damping: 200}});
  const size = interpolate(close, [0, 1], [620, 460]);
  const flash = beatPulse(f);
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div
        style={{
          width: size,
          height: 150,
          border: `2px solid ${C.red}`,
          boxShadow: `0 0 ${20 + flash * 40}px ${C.red}`,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255,39,66,0.08)",
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 40, color: C.text, fontWeight: 700}}>VIDEOTRON-5G</div>
        <div style={{fontFamily: MONO, fontSize: 18, color: C.red, letterSpacing: 6, marginTop: 8}}>◄ TARGET LOCKED ►</div>
      </div>
    </AbsoluteFill>
  );
};

const Deauth: React.FC = () => {
  const f = useCurrentFrame();
  const captured = f > 5 * BEAT;
  const pulse = beatPulse(f);
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", gap: 30}}>
      {!captured && (
        <>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.red, opacity: 0.5 + pulse * 0.5}}>aireplay-ng --deauth ∞</div>
          <div style={{display: "flex", gap: 14}}>
            {Array.from({length: 10}).map((_, i) => {
              const on = beatPulse(f, -i) > 0.3;
              return (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 60 + (i % 3) * 20,
                    background: on ? C.red : C.redDeep,
                    boxShadow: on ? `0 0 18px ${C.red}` : "none",
                    transform: `scaleY(${0.6 + beatPulse(f, -i) * 0.6})`,
                  }}
                />
              );
            })}
          </div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>kicking clients off the network…</div>
        </>
      )}
      {captured && (
        <div style={{transform: `scale(${spring({frame: f - 5 * BEAT, fps: FPS})})`}}>
          <div
            style={{
              border: `3px solid ${C.green}`,
              color: C.green,
              fontFamily: MONO,
              fontSize: 46,
              fontWeight: 700,
              padding: "20px 50px",
              borderRadius: 10,
              boxShadow: `0 0 40px ${C.green}`,
              letterSpacing: 4,
              background: "rgba(5,7,12,0.6)",
            }}
          >
            ✓ HANDSHAKE CAPTURED
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const RogueAP: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    "[+] spawning rogue access point…",
    "[+] SSID: VIDEOTRON-5G  (clone)",
    "[+] starting DNS spoof → 10.0.0.1",
    "[+] starting web server :80",
    "[+] captive portal armed",
  ];
  return (
    <AbsoluteFill style={{padding: "90px 240px", justifyContent: "center"}}>
      <div style={{fontFamily: MONO, fontSize: 24, color: C.amber, marginBottom: 20}}>⚡ FLUXION · rogue AP</div>
      {lines.map((l, i) => {
        const start = 6 + i * Math.floor(BEAT * 0.8);
        const op = interpolate(f, [start, start + 3], [0, 1], {extrapolateRight: "clamp", extrapolateLeft: "clamp"});
        return (
          <div key={i} style={{opacity: op, fontFamily: MONO, fontSize: 24, color: C.green, margin: "7px 0"}}>
            {typed(l, f, start, 2.4)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Cursor: React.FC<{f: number}> = ({f}) => {
  const x = interpolate(f, [0, 24, 40, 60], [780, 760, 760, 700], {extrapolateRight: "clamp"});
  const y = interpolate(f, [0, 24, 40, 60], [300, 250, 250, 360], {extrapolateRight: "clamp"});
  return (
    <svg width="26" height="30" style={{position: "absolute", left: x, top: y, zIndex: 10}}>
      <path d="M2 2 L2 24 L8 18 L12 27 L16 25 L12 16 L20 16 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
    </svg>
  );
};

const Portal: React.FC = () => {
  const f = useCurrentFrame();
  const pwd = typed("●●●●●●●●●●", f, 26, 0.7);
  const click = beatPulse(f, -4 * BEAT) > 0.4 && f > 56;
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div style={{width: 540, background: "#0e1422", border: `1px solid ${C.border}`, borderRadius: 14, padding: "34px 40px", fontFamily: SANS, boxShadow: "0 20px 60px rgba(0,0,0,0.6)"}}>
        <div style={{fontSize: 26, fontWeight: 600, color: "#fff", marginBottom: 4}}>VIDEOTRON</div>
        <div style={{fontSize: 15, color: C.dim, marginBottom: 24}}>Router firmware update — re-enter your Wi-Fi password to continue</div>
        <div style={{fontSize: 13, color: C.dim, marginBottom: 6}}>Wi-Fi password</div>
        <div style={{height: 44, border: `1px solid ${C.border}`, borderRadius: 8, background: "#070b12", display: "flex", alignItems: "center", padding: "0 14px", fontFamily: MONO, fontSize: 22, color: C.text, letterSpacing: 3}}>
          {pwd}
          <span style={{opacity: beatPulse(f) > 0.5 ? 1 : 0.2}}>|</span>
        </div>
        <div style={{marginTop: 22, height: 46, borderRadius: 8, background: click ? "#0a8a3a" : "#0c6e30", transform: `scale(${click ? 0.97 : 1})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 17}}>
          Connect
        </div>
      </div>
      <Cursor f={f} />
    </AbsoluteFill>
  );
};

const Punch: React.FC = () => {
  const f = useCurrentFrame();
  const hit = spring({frame: f, fps: FPS, config: {damping: 12, stiffness: 200}});
  const flash = interpolate(f, [0, 4, 14], [0.9, 0.3, 0], {extrapolateRight: "clamp"});
  const twist = interpolate(f, [40, 55], [0, 1], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <AbsoluteFill style={{background: C.red, opacity: flash}} />
      <div style={{transform: `scale(${interpolate(hit, [0, 1], [0.4, 1])})`, textAlign: "center"}}>
        <Glitch text="PASSWORD STOLEN" size={92} color="#fff" jitter={1.8} />
        <div style={{fontFamily: MONO, fontSize: 34, color: C.green, marginTop: 18, letterSpacing: 3}}>montreal2019!</div>
      </div>
      <div style={{position: "absolute", bottom: 120, opacity: twist, fontFamily: MONO, fontSize: 24, color: C.text, textAlign: "center", lineHeight: 1.6}}>
        <span style={{color: C.red}}>defense →</span> use WPA3 · never re-enter your pwd on a popup<br />
        <span style={{color: C.dim, fontSize: 18}}>a real router never asks for it</span>
      </div>
    </AbsoluteFill>
  );
};

const makeBrollShot = (src: string, line: string): React.FC => () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10], [0, 1], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <BRoll src={src} opacity={0.75} tint={false} />
      <AbsoluteFill style={{background: "rgba(5,7,12,0.45)"}} />
      {line ? (
        <div style={{position: "relative", opacity: op, transform: `scale(${1 + beatPulse(f) * 0.03})`}}>
          <Glitch text={line} size={50} jitter={1.1} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

type Scene = {Comp: React.FC; dur: number; broll?: string; op?: number};

const SCENES_30: Scene[] = [
  {Comp: ColdOpen, dur: 120, broll: "matrix", op: 0.25},
  {Comp: Scan, dur: 160, broll: "projcode", op: 0.1},
  {Comp: TargetLock, dur: 100, broll: "code", op: 0.1},
  {Comp: Deauth, dur: 160, broll: "typing", op: 0.14},
  {Comp: RogueAP, dur: 120, broll: "code", op: 0.1},
  {Comp: Portal, dur: 140},
  {Comp: Punch, dur: 100, broll: "matrix", op: 0.3},
];

const SCENES_60: Scene[] = [
  {Comp: ColdOpen, dur: 160, broll: "matrix", op: 0.25},
  {Comp: makeBrollShot("hood", "they're listening to the air"), dur: 120},
  {Comp: Scan, dur: 240, broll: "projcode", op: 0.1},
  {Comp: TargetLock, dur: 140, broll: "code", op: 0.1},
  {Comp: makeBrollShot("typing", "one fake page is all it takes"), dur: 100},
  {Comp: Deauth, dur: 240, broll: "typing", op: 0.14},
  {Comp: RogueAP, dur: 200, broll: "code", op: 0.1},
  {Comp: Portal, dur: 260},
  {Comp: makeBrollShot("matrix", ""), dur: 100},
  {Comp: Punch, dur: 140, broll: "matrix", op: 0.3},
];

export const FluxionVid: React.FC<{variant?: string; beat?: string}> = ({
  variant = "30",
  beat = "fluxion_beat30.wav",
}) => {
  const scenes = variant === "60" ? SCENES_60 : SCENES_30;
  let off = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile(beat)} />
      {scenes.map((s, i) => {
        const from = off;
        off += s.dur;
        const Comp = s.Comp;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            {s.broll ? <BRoll src={s.broll} opacity={s.op ?? 0.18} /> : null}
            <Comp />
          </Sequence>
        );
      })}
      <Scanlines />
      <Vignette />
    </AbsoluteFill>
  );
};
