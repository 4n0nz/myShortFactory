import {
  AbsoluteFill,
  Sequence,
  Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";

const FPS = 30;
const BPM = 90;
const BEAT = (FPS * 60) / BPM;
const MONO = "'Cascadia Code','DejaVu Sans Mono','Consolas',monospace";
const SANS = "'Cantarell','Segoe UI',sans-serif";
const T = {
  termBg: "#0a121e", grey: "#cfd8e3", dim: "#8a97a8", green: "#3df07a",
  cyan: "#28d3e6", red: "#ff3b4e", yellow: "#f5c542", blue: "#4aa3ff",
};

const useV = () => {
  const {width, height} = useVideoConfig();
  return height > width;
};
const beatPulse = (f: number, off = 0) => {
  const phase = ((f - off) % BEAT) / BEAT;
  return Math.max(0, 1 - Math.max(0, phase) * 3.2);
};
const reveal = (f: number, at: number, dur = 6) =>
  interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const typed = (text: string, f: number, start: number, cps = 2.4) =>
  text.slice(0, Math.max(0, Math.floor((f - start) * cps)));
const blink = (f: number) => (beatPulse(f) > 0.5 ? 1 : 0.25);
const Line: React.FC<{show: boolean; children: React.ReactNode}> = ({show, children}) =>
  show ? <div>{children}</div> : null;

// ---------- PHASE BADGE ----------
const Badge: React.FC<{n: number; label: string}> = ({n, label}) => {
  const f = useCurrentFrame();
  const op = reveal(f, 4, 8);
  return (
    <div style={{position: "absolute", top: 40, left: 40, opacity: op, zIndex: 30, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO}}>
      <span style={{background: T.red, color: "#fff", fontWeight: 700, fontSize: 22, padding: "2px 12px", borderRadius: 6}}>{n}</span>
      <span style={{color: T.red, fontSize: 20, letterSpacing: 4, fontWeight: 700}}>{label}</span>
    </div>
  );
};

// ---------- GLITCH TITLE (for b-roll cards) ----------
const Glitch: React.FC<{text: string; size: number}> = ({text, size}) => {
  const f = useCurrentFrame();
  const j = beatPulse(f);
  const dx = (random(`g${Math.floor(f / 2)}`) - 0.5) * 7 * j;
  return (
    <div style={{position: "relative", fontFamily: MONO, fontWeight: 700, fontSize: size, textAlign: "center"}}>
      <span style={{position: "absolute", left: dx - 3, right: 0, color: T.red, opacity: 0.7}}>{text}</span>
      <span style={{position: "absolute", left: dx + 3, right: 0, color: T.cyan, opacity: 0.55}}>{text}</span>
      <span style={{position: "relative", color: "#fff", textShadow: `0 0 22px ${T.red}`}}>{text}</span>
    </div>
  );
};

// ---------- B-ROLL CARD (cutaway + phase title) ----------
const BrollCard: React.FC<{src: string; n: number; title: string}> = ({src, n, title}) => {
  const f = useCurrentFrame();
  const V = useV();
  const op = reveal(f, 2, 8);
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", background: "#04060c"}}>
      <OffthreadVideo src={staticFile(`broll2/${src}.mp4`)} muted style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.85}} />
      <AbsoluteFill style={{background: "rgba(4,6,12,0.5)"}} />
      <div style={{position: "relative", opacity: op, transform: `scale(${1 + beatPulse(f) * 0.04})`, textAlign: "center"}}>
        <div style={{fontFamily: MONO, color: T.red, fontSize: V ? 22 : 28, fontWeight: 700, letterSpacing: 3, marginBottom: 8}}>
          {String(n).padStart(2, "0")} /
        </div>
        <Glitch text={title} size={V ? 40 : 64} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- CHROME (phase 1: recherche) ----------
const FluxionPage: React.FC<{f: number}> = ({f}) => {
  const V = useV();
  const op = reveal(f, 0, 10);
  return (
    <div style={{opacity: op, background: "#1f1f1f", height: "100%", overflow: "hidden", fontFamily: MONO, color: T.grey}}>
      <div style={{padding: V ? "20px 26px" : "26px 56px"}}>
        <div style={{color: T.green, fontSize: V ? 24 : 30, fontWeight: 700}}>./ fluxion</div>
        <div style={{color: T.dim, fontSize: V ? 14 : 17, marginTop: 6}}>Fluxion is a remake of linset by vk496 with enhanced functionality.</div>
        <div style={{marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, background: "#2c2c2c", border: "1px solid #444", borderRadius: 8, padding: "8px 16px", fontSize: V ? 13 : 15}}>⌥ View on GitHub</div>
        <div style={{borderTop: "1px dashed #3a3a3a", margin: "20px 0"}} />
        <div style={{height: V ? 340 : 290, borderRadius: 6, background: "radial-gradient(ellipse at 70% 40%, #1b4a7a 0%, #0c2542 45%, #050d1a 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <div style={{fontSize: V ? 70 : 92, fontWeight: 800, letterSpacing: 4, fontFamily: SANS}}>
            <span style={{color: "#fff"}}>FLU</span><span style={{color: T.cyan}}>[X]</span><span style={{color: "#fff"}}>ION</span>
          </div>
          <div style={{color: "#a8c4dd", letterSpacing: 8, fontSize: V ? 14 : 18, marginTop: 4, fontFamily: SANS}}>THE #1 WIFI CRACKER</div>
        </div>
        <div style={{color: T.green, fontSize: V ? 22 : 28, fontWeight: 700, marginTop: 22}}>Fluxion is the future of MITM WPA attacks</div>
        <div style={{color: T.dim, fontSize: V ? 14 : 16, marginTop: 10, lineHeight: 1.7}}>A security auditing &amp; social-engineering tool. It retrieves the WPA/WPA2 key via a phishing attack.</div>
      </div>
    </div>
  );
};
const ChromeScene: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const {width, height} = useVideoConfig();
  const navigated = f > 60;
  const winIn = spring({frame: f, fps: FPS, config: {damping: 200}});
  const wW = width - (V ? 32 : 360);
  const wH = height - (V ? 130 : 200);
  return (
    <AbsoluteFill style={{background: "#0c1420", justifyContent: "center", alignItems: "center"}}>
      <div style={{width: wW, height: wH, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", transform: `translateY(${interpolate(winIn, [0, 1], [40, 0])}px)`, opacity: winIn}}>
        <div style={{height: 42, background: "#35363a", display: "flex", alignItems: "flex-end", padding: "0 10px"}}>
          <div style={{background: "#202124", color: "#e8eaed", borderRadius: "8px 8px 0 0", padding: "8px 16px", fontSize: V ? 12 : 14, fontFamily: SANS, display: "flex", alignItems: "center", gap: 8}}>
            <span style={{width: 12, height: 12, borderRadius: 3, background: T.green}} />{navigated ? "fluxion · WiFi cracker" : "Nouvel onglet"} ✕
          </div>
        </div>
        <div style={{height: 50, background: "#202124", display: "flex", alignItems: "center", gap: 12, padding: "0 14px"}}>
          <span style={{color: "#9aa0a6", fontSize: 16}}>←  →  ⟳</span>
          <div style={{flex: 1, height: 32, background: "#35363a", borderRadius: 18, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: SANS, fontSize: V ? 13 : 15, color: "#e8eaed", overflow: "hidden", whiteSpace: "nowrap"}}>
            <span style={{color: "#9aa0a6", marginRight: 10}}>{navigated ? "🔒" : "🔍"}</span>
            {navigated ? "fluxionnetwork.github.io/fluxion" : typed("fluxion wifi cracker github", f, 8, 2.4)}
            {!navigated && <span style={{opacity: blink(f)}}>|</span>}
          </div>
        </div>
        <div style={{height: wH - 92}}>{navigated ? <FluxionPage f={f - 60} /> : <div style={{background: "#202124", height: "100%"}} />}</div>
      </div>
      <Badge n={1} label="RECHERCHE" />
    </AbsoluteFill>
  );
};

// ---------- KALI TERMINAL SHELL ----------
const KaliDesktop: React.FC = () => (
  <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 38%, #1f6aa0 0%, #114066 38%, #07203a 72%, #04101f 100%)"}}>
    <div style={{height: 30, background: "#1c1f24", display: "flex", alignItems: "center", gap: 16, padding: "0 12px", fontFamily: SANS, fontSize: 13, color: "#e6e6e6", borderBottom: "1px solid #000"}}>
      <span>Applications ▾</span><span>Emplacements ▾</span>
      <span style={{flex: 1, textAlign: "center", color: "#cfe"}}>mar. 17:39</span>
      <span style={{background: "#444", padding: "0 7px", borderRadius: 3}}>1</span>
      <span style={{color: T.red, fontFamily: MONO}}>00:03:18</span>
    </div>
    <div style={{position: "absolute", top: 30, left: 0, width: 42, bottom: 0, background: "rgba(20,24,30,0.55)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 12}}>
      {["#2b7de9", "#e8e8e8", "#e8732b", "#1f8a4c", "#c0392b", "#3aa0d0"].map((c, i) => <div key={i} style={{width: 28, height: 28, borderRadius: 7, background: c, opacity: 0.9}} />)}
    </div>
  </AbsoluteFill>
);
const Prompt: React.FC<{cmd: string; f: number; start: number; fz: number}> = ({cmd, f, start, fz}) => (
  <div style={{margin: "3px 0", fontSize: fz}}>
    <span style={{color: T.green}}>root@kali</span><span style={{color: T.grey}}>:</span><span style={{color: T.blue}}>~</span><span style={{color: T.grey}}>$ </span>
    <span style={{color: T.grey, wordBreak: "break-all"}}>{typed(cmd, f, start, 3)}</span><span style={{background: T.green, opacity: blink(f), marginLeft: 1}}>█</span>
  </div>
);
const Dash: React.FC<{color: string}> = ({color}) => (
  <div style={{display: "flex", alignItems: "center"}}><span style={{color: T.grey}}>[</span><span style={{flex: 1, overflow: "hidden", whiteSpace: "nowrap", color}}>{"-".repeat(220)}</span><span style={{color: T.grey}}>]</span></div>
);
const FluxBanner: React.FC<{fz: number}> = ({fz}) => (
  <div style={{fontFamily: MONO, fontSize: fz, lineHeight: 1.25}}>
    <Dash color={T.red} />
    <div style={{display: "flex", justifyContent: "space-between"}}><span style={{color: T.grey}}>[</span><span style={{color: T.grey}}>]</span></div>
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <span style={{color: T.grey}}>[</span>
      <span style={{fontWeight: 700, whiteSpace: "nowrap"}}>
        <span style={{color: T.red}}>FLUXION </span><span style={{color: T.red}}>6</span><span style={{color: T.grey}}>.</span><span style={{color: T.blue}}>7</span><span>{"    "}</span>
        <span style={{color: T.red}}>{"< "}</span><span style={{color: T.red}}>F</span><span style={{color: T.yellow}}>luxion </span><span style={{color: T.red}}>I</span><span style={{color: T.yellow}}>s </span><span style={{color: T.red}}>T</span><span style={{color: T.yellow}}>he </span><span style={{color: T.red}}>F</span><span style={{color: T.yellow}}>uture </span><span style={{color: T.yellow}}>{">"}</span>
      </span>
      <span style={{color: T.grey}}>]</span>
    </div>
    <div style={{display: "flex", justifyContent: "space-between"}}><span style={{color: T.grey}}>[</span><span style={{color: T.grey}}>]</span></div>
    <Dash color={T.blue} />
  </div>
);

const PhaseContent: React.FC<{phase: string; long: boolean; fz: number; bfz: number; V: boolean}> = ({phase, long, fz, bfz, V}) => {
  const f = useCurrentFrame();
  if (phase === "download") {
    return (
      <div style={{fontFamily: MONO, fontSize: fz, lineHeight: 1.5, color: T.grey}}>
        <Prompt cmd="git clone https://github.com/FluxionNetwork/fluxion.git" f={f} start={4} fz={fz} />
        <Line show={reveal(f, 38) > 0.5}><span style={{color: T.dim}}>Cloning into 'fluxion'...</span></Line>
        <Line show={reveal(f, 50) > 0.5}><span style={{color: T.dim}}>remote: Enumerating objects: 3024, done.</span></Line>
        <Line show={reveal(f, 60) > 0.5}><span style={{color: T.dim}}>Receiving objects: {Math.min(100, Math.floor(interpolate(f, [60, 88], [0, 100])))}% ({Math.min(3024, Math.floor(interpolate(f, [60, 88], [0, 3024])))}/3024)</span></Line>
        <Line show={reveal(f, 90) > 0.5}><span style={{color: T.green}}>[+] Dépôt cloné avec succès ✓</span></Line>
      </div>
    );
  }
  if (phase === "install") {
    return (
      <div style={{fontFamily: MONO, fontSize: fz, lineHeight: 1.5, color: T.grey}}>
        <Prompt cmd="cd fluxion" f={f} start={4} fz={fz} />
        <Line show={reveal(f, 28) > 0.5}><Prompt cmd="ls" f={f} start={32} fz={fz} /></Line>
        <Line show={reveal(f, 52) > 0.5}><span style={{color: T.blue}}>attacks  language  lib  fluxion.sh  preferences</span></Line>
        <Line show={reveal(f, 72) > 0.5}><Prompt cmd="sudo ./fluxion.sh" f={f} start={76} fz={fz} /></Line>
        <Line show={reveal(f, 100) > 0.5}><span style={{color: T.green}}>[*] </span>Vérification des dépendances...</Line>
        <Line show={reveal(f, 118) > 0.5}><span style={{color: T.green}}>[+] </span>aircrack-ng · hostapd · dnsmasq · mdk4 <span style={{color: T.green}}>OK</span></Line>
        <Line show={reveal(f, 138) > 0.5}><span style={{color: T.green}}>[*] </span>Démarrage de FLUXION...</Line>
      </div>
    );
  }
  if (phase === "simulate") {
    return (
      <div style={{fontFamily: MONO, fontSize: fz, lineHeight: 1.4, color: T.grey}}>
        <div style={{opacity: reveal(f, 0)}}><FluxBanner fz={bfz} /></div>
        <div style={{marginTop: 14}}>
          <Line show={reveal(f, 24) > 0.5}><span style={{color: T.green}}>[*] </span>Interface de monitoring <span style={{color: T.green}}>wlan0mon</span></Line>
          <Line show={reveal(f, 40) > 0.5}><div style={{marginTop: 6}}><span style={{color: T.cyan}}>[?] </span>Sélectionnez une attaque wireless</div></Line>
          <Line show={reveal(f, 52) > 0.5}><div style={{color: T.dim}}><div><span style={{color: T.yellow}}>  [1] </span>Captive Portal</div><div><span style={{color: T.yellow}}>  [2] </span>Handshake Snooper</div></div></Line>
          <Line show={reveal(f, 70) > 0.5}>
            <div style={{margin: "3px 0"}}>
              <span style={{color: T.red}}>[</span><span style={{color: T.green}}>fluxion</span><span style={{color: T.cyan}}>@</span><span style={{color: T.green}}>kali</span><span style={{color: T.red}}>]</span><span style={{color: T.grey}}>-</span><span style={{color: T.red}}>[</span><span style={{color: T.yellow}}>~</span><span style={{color: T.red}}>] </span>
              <span style={{color: T.grey}}>{typed("1", f, 74, 3)}</span><span style={{background: T.green, opacity: blink(f)}}>█</span>
            </div>
          </Line>
          {long && (
            <Line show={reveal(f, 96) > 0.5}>
              <div style={{fontSize: fz - 2, marginTop: 4}}>
                <div><span style={{color: T.green}}>[*] </span>Recherche des cibles...</div>
                <div style={{color: T.dim}}>  BSSID            PWR CH ESSID</div>
                {[["EC:10:7B:F4:E8:21", "-42", "10", "Myphone", true], ["A0:2B:11:9C:33:01", "-67", " 6", "Bell_A4F2", false]].map((r, i) => (
                  <div key={i} style={{color: r[4] ? T.green : T.grey, opacity: reveal(f, 102 + i * 6)}}> {i + 1}) {r[0]}  {r[1]} {r[2]} {r[3]}{r[4] ? " ◄" : ""}</div>
                ))}
              </div>
            </Line>
          )}
          <Line show={reveal(f, long ? 130 : 92) > 0.5}>
            <div style={{marginTop: 6, marginLeft: V ? 8 : 36, lineHeight: 1.5}}>
              <div><span style={{color: T.cyan}}>ESSID:</span>  <span style={{color: T.green}}>"Myphone" / WPA2</span></div>
              <div><span style={{color: T.cyan}}>Channel:</span>  <span style={{color: T.grey}}>10</span></div>
              <div><span style={{color: T.cyan}}>BSSID:</span>  <span style={{color: T.grey}}>EC:10:7B:F4:E8:21</span></div>
            </div>
          </Line>
          <Line show={reveal(f, long ? 170 : 116) > 0.5}><div style={{marginTop: 8, color: T.red}}>◄ CIBLE VERROUILLÉE ►</div></Line>
        </div>
      </div>
    );
  }
  // demo
  return (
    <div style={{fontFamily: MONO, fontSize: fz, lineHeight: 1.45, color: T.grey}}>
      <Line show={reveal(f, 0) > 0.5}><div><span style={{color: T.cyan}}>Handshake Snooper</span> attaque en cours...</div></Line>
      <Line show={reveal(f, 16) > 0.5}><span style={{color: T.green}}>[*] </span>Capture du handshake WPA <span style={{opacity: blink(f)}}>{".".repeat(3 + (Math.floor(f / 6) % 3))}</span></Line>
      <Line show={reveal(f, 52) > 0.5}><div style={{color: T.green, fontWeight: 700}}>[+] Handshake capturé !  ✓</div></Line>
      {long && <Line show={reveal(f, 84) > 0.5}><span style={{color: T.green}}>[+] </span>Hash vérifié (aircrack-ng) <span style={{color: T.green}}>OK</span></Line>}
      <Line show={reveal(f, long ? 116 : 84) > 0.5}><div><span style={{color: T.green}}>[*] </span>Point d'accès rogue <span style={{color: T.green}}>"Myphone"</span></div></Line>
      <Line show={reveal(f, long ? 140 : 104) > 0.5}><div><span style={{color: T.green}}>[*] </span>DNS spoof · portail captif armé</div></Line>
      <Line show={reveal(f, long ? 180 : 130) > 0.5}><div style={{color: T.yellow}}><span style={{color: T.green}}>[+] </span>Victime connectée → mot de passe soumis</div></Line>
    </div>
  );
};

const TermPhase: React.FC<{phase: string; n: number; label: string; long: boolean}> = ({phase, n, label, long}) => {
  const f = useCurrentFrame();
  const V = useV();
  const fz = V ? 16 : 20;
  const bfz = V ? 12 : 18;
  const winIn = spring({frame: f, fps: FPS, config: {damping: 200}});
  const mx = V ? 16 : 130;
  const topBase = V ? 60 : 66;
  const botBase = V ? 60 : 54;
  return (
    <AbsoluteFill>
      <KaliDesktop />
      <div style={{position: "absolute", left: mx, right: mx, top: topBase, bottom: botBase, opacity: winIn, borderRadius: 8, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)"}}>
        <div style={{height: 36, background: "#d6d8da", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: SANS, fontSize: V ? 13 : 15, color: "#222"}}>
          root@ismail-jalal: ~/fluxion
          <div style={{position: "absolute", right: 10, display: "flex", gap: 12, color: "#555"}}><span>—</span><span>▢</span><span>✕</span></div>
        </div>
        <div style={{height: 28, background: "#ececec", display: "flex", alignItems: "center", gap: V ? 12 : 20, padding: "0 12px", fontFamily: SANS, fontSize: V ? 11 : 13, color: "#333"}}>
          {["Fichier", "Édition", "Affichage", "Rechercher", "Terminal", "Aide"].map((m) => <span key={m}>{m}</span>)}
        </div>
        <div style={{position: "absolute", top: 64, left: 0, right: 0, bottom: 0, background: T.termBg, padding: V ? "14px 16px" : "18px 24px", overflow: "hidden"}}>
          <PhaseContent phase={phase} long={long} fz={fz} bfz={bfz} V={V} />
        </div>
      </div>
      <Badge n={n} label={label} />
    </AbsoluteFill>
  );
};

const Punch: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const hit = spring({frame: f, fps: FPS, config: {damping: 13, stiffness: 200}});
  const flash = interpolate(f, [0, 5, 16], [0.55, 0.2, 0], {extrapolateRight: "clamp"});
  const twist = reveal(f, 34, 14);
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 30}}>
      <AbsoluteFill style={{background: T.red, opacity: flash}} />
      <div style={{transform: `scale(${interpolate(hit, [0, 1], [0.5, 1])})`, textAlign: "center"}}>
        <div style={{fontFamily: MONO, fontSize: V ? 22 : 30, color: T.green, letterSpacing: 2}}>[+] MOT DE PASSE CAPTURÉ</div>
        <div style={{fontFamily: MONO, fontSize: V ? 46 : 64, color: "#fff", fontWeight: 700, marginTop: 12, textShadow: `0 0 28px ${T.red}`}}>montreal2019!</div>
      </div>
      <div style={{position: "absolute", bottom: V ? 200 : 90, opacity: twist, fontFamily: MONO, fontSize: V ? 17 : 22, color: T.grey, textAlign: "center", lineHeight: 1.6, padding: "0 20px"}}>
        <span style={{color: T.red}}>défense →</span> WPA3 · ton routeur ne te redemande JAMAIS ton mot de passe<br />
        <span style={{color: T.dim, fontSize: V ? 14 : 17}}>un popup qui demande ton wifi = arnaque</span>
      </div>
    </AbsoluteFill>
  );
};

type Seg =
  | {t: "chrome"; d: number}
  | {t: "broll"; d: number; src: string; n: number; title: string}
  | {t: "term"; d: number; phase: string; n: number; label: string}
  | {t: "punch"; d: number};

const SEGS_30: Seg[] = [
  {t: "chrome", d: 140},
  {t: "broll", d: 40, src: "hood2", n: 2, title: "TÉLÉCHARGEMENT"},
  {t: "term", d: 100, phase: "download", n: 2, label: "TÉLÉCHARGEMENT"},
  {t: "broll", d: 40, src: "matrix2", n: 3, title: "INSTALLATION"},
  {t: "term", d: 120, phase: "install", n: 3, label: "INSTALLATION"},
  {t: "broll", d: 40, src: "monitors", n: 4, title: "SIMULATION"},
  {t: "term", d: 120, phase: "simulate", n: 4, label: "SIMULATION"},
  {t: "broll", d: 40, src: "redmon", n: 5, title: "DÉMONSTRATION"},
  {t: "term", d: 140, phase: "demo", n: 5, label: "DÉMONSTRATION"},
  {t: "punch", d: 120},
];
const SEGS_60: Seg[] = [
  {t: "chrome", d: 220},
  {t: "broll", d: 60, src: "hood2", n: 2, title: "TÉLÉCHARGEMENT"},
  {t: "term", d: 200, phase: "download", n: 2, label: "TÉLÉCHARGEMENT"},
  {t: "broll", d: 60, src: "matrix2", n: 3, title: "INSTALLATION"},
  {t: "term", d: 240, phase: "install", n: 3, label: "INSTALLATION"},
  {t: "broll", d: 60, src: "monitors", n: 4, title: "SIMULATION"},
  {t: "term", d: 280, phase: "simulate", n: 4, label: "SIMULATION"},
  {t: "broll", d: 60, src: "anon", n: 5, title: "DÉMONSTRATION"},
  {t: "term", d: 300, phase: "demo", n: 5, label: "DÉMONSTRATION"},
  {t: "broll", d: 60, src: "redmon", n: 5, title: "RÉSULTAT"},
  {t: "punch", d: 260},
];

export const FluxionReal: React.FC<{beat?: string; long?: boolean}> = ({beat = "fluxion_beat30.wav", long = false}) => {
  const segs = long ? SEGS_60 : SEGS_30;
  let off = 0;
  return (
    <AbsoluteFill style={{background: "#04060c"}}>
      <Audio src={staticFile(beat)} />
      {segs.map((s, i) => {
        const from = off;
        off += s.d;
        return (
          <Sequence key={i} from={from} durationInFrames={s.d}>
            {s.t === "chrome" && <ChromeScene />}
            {s.t === "broll" && <BrollCard src={s.src} n={s.n} title={s.title} />}
            {s.t === "term" && <TermPhase phase={s.phase} n={s.n} label={s.label} long={long} />}
            {s.t === "punch" && (<><AbsoluteFill style={{background: "#04060c"}} /><Punch /></>)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
