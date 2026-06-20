import {Composition} from "remotion";
import {Video} from "./Video";
import {SubsTerminal} from "./SubsTerminal";
import {MatrixRain} from "./MatrixRain";
import {BrowserSearch} from "./BrowserSearch";
import {ActionScene} from "./ActionScene";
import {FluxionVid} from "./FluxionVid";
import {FluxionReal} from "./FluxionReal";
import cues from "../cues.json";
import manifest from "../render-manifest.json";
import captions from "../captions.json";

const total = manifest.scenes.reduce(
  (acc: number, s: any) => acc + s.durationInFrames,
  0
);

const fps = manifest.meta.fps;
const caps = captions as {start: number; end: number; text: string}[];
const subDur = caps.length
  ? Math.ceil((caps[caps.length - 1].end + 0.6) * fps)
  : 300;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Tutorial"
        component={Video}
        durationInFrames={total}
        fps={fps}
        width={manifest.meta.width}
        height={manifest.meta.height}
      />
      <Composition
        id="SubsTerminal"
        component={SubsTerminal}
        durationInFrames={subDur}
        fps={fps}
        width={520}
        height={260}
      />
      <Composition
        id="MatrixRain"
        component={MatrixRain}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BrowserSearch"
        component={BrowserSearch}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ActionScene"
        component={ActionScene}
        durationInFrames={Math.ceil((((cues as any).audioDur ?? 12) + 0.6) * 30)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FluxionVid30"
        component={FluxionVid}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{variant: "30", beat: "fluxion_beat30.wav"}}
      />
      <Composition
        id="FluxionReal30"
        component={FluxionReal}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{beat: "fluxion_beat30.wav", long: false}}
      />
      <Composition
        id="FluxionReal30V"
        component={FluxionReal}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{beat: "fluxion_beat30.wav", long: false}}
      />
      <Composition
        id="FluxionReal60"
        component={FluxionReal}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{beat: "fluxion_beat60.wav", long: true}}
      />
      <Composition
        id="FluxionReal60V"
        component={FluxionReal}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{beat: "fluxion_beat60.wav", long: true}}
      />
      <Composition
        id="FluxionVid60"
        component={FluxionVid}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{variant: "60", beat: "fluxion_beat60.wav"}}
      />
    </>
  );
};
