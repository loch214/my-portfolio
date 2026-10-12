'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Play } from 'lucide-react';

/* The player's JavaScript only loads once someone presses play. Until it
   arrives, the poster's own box (same 16:9 frame) holds the space. */
const CaseStudyPlayer = dynamic(() => import('@/components/CaseStudyPlayer'), {
  ssr: false,
  loading: () => <div className="aspect-video w-full bg-neutral-900" />,
});

interface VideoEmbedProps {
  url: string;
  caption: string;
}

/* Click-to-play case-study video: YouTube-hosted, played through Video.js 10.

   Why not a bare YouTube iframe: YouTube's own UI surfaced recommended videos
   (on pause, on hover, and on the end screen), some of them unrelated and
   unwanted on a portfolio. Video.js drives the embed through the iframe API
   with YouTube's controls off (`controls=0`, `rel=0`, `iv_load_policy=3`) and
   draws its own skin on top — play, scrub, ±10s (buttons, arrow keys, j/l,
   double tap), playback speed, volume, fullscreen. There is no manual quality
   selector: YouTube's iframe API no longer lets a page choose quality, it
   adapts on its own. Hosting the files elsewhere (Mux) was offered and
   declined by the owner.

   Two rules carried over from the old embed:

   - Nothing YouTube loads until the visitor clicks. A YouTube player is ~1MB
     of script plus a request waterfall, and every case study is built around
     one or two of them — mounting them on page load was almost the whole
     reason a case study felt slow to open. The poster is one ~20KB thumbnail.
   - When the video ends we drop back to the poster, before YouTube's end
     screen (a grid of suggested videos) can appear.

   hqdefault.jpg is 480×360: the 16:9 frame letterboxed into 4:3. Covering a
   16:9 box with it crops exactly the black bars. */

const YOUTUBE_ID = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/;

function youtubeId(url: string) {
  return url.match(YOUTUBE_ID)?.[1] ?? null;
}

export default function VideoEmbed({ url, caption }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);

  // Not a YouTube URL we can read an id out of (e.g. an unfilled placeholder):
  // render nothing playable rather than a broken player.
  if (!id) {
    return (
      <div className="relative grid aspect-video w-full place-items-center bg-neutral-900">
        <p className="t-meta">Video coming soon</p>
      </div>
    );
  }

  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  /* The player skin, served unlayered by app/vendor/videojs-skin.css/route.ts
     (see there for why it can't be imported). Rendered with the poster too, so
     it's already loaded by the time someone presses play, and only on pages
     that actually have a video. In <body>, so it lands after the app
     stylesheet and wins equal-specificity ties against Tailwind's preflight. */
  const skin = <link rel="stylesheet" href="/vendor/videojs-skin.css" />;

  if (playing) {
    return (
      <>
        {skin}
        <CaseStudyPlayer youtubeId={id} caption={caption} onEnded={() => setPlaying(false)} />
      </>
    );
  }

  return (
    <>
      {skin}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        // Start fetching the player as the pointer arrives, so it's usually
        // loaded by the click — autoplay is only allowed for a few seconds
        // after the click that asked for it.
        onPointerEnter={() => void import('@/components/CaseStudyPlayer')}
        onFocus={() => void import('@/components/CaseStudyPlayer')}
        className="group relative block aspect-video w-full overflow-hidden bg-neutral-900"
        aria-label={`Play video: ${caption}`}
      >
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-bg/30 transition-colors duration-300 group-hover:bg-bg/15"
        />
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span className="btn btn-primary elev-md transition-transform duration-300 group-hover:scale-105">
            <Play size={16} strokeWidth={2.5} />
            Play video
          </span>
        </span>
      </button>
    </>
  );
}
