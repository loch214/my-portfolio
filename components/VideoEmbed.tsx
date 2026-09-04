'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  caption: string;
}

/* Click-to-play YouTube embed.

   The iframe is not mounted until the visitor asks for it. A YouTube player is
   roughly a megabyte of script plus a request waterfall to youtube.com,
   googlevideo and doubleclick, and every case study on this site is built
   around one or two of them — mounting them on page load was almost the whole
   reason a case study took so long to become usable. The poster is a single
   ~20KB thumbnail from YouTube's own CDN.

   hqdefault.jpg is 480×360: the 16:9 frame letterboxed into 4:3. Covering a
   16:9 box with it crops exactly the black bars, so no other size is needed —
   maxresdefault is natively 16:9 but only exists for HD uploads. */

const YOUTUBE_ID = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/;

function posterUrl(url: string) {
  const id = url.match(YOUTUBE_ID)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/* Clicking the poster should play, not hand over a second play button. */
function autoplayUrl(url: string) {
  return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
}

export default function VideoEmbed({ url, caption }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const poster = posterUrl(url);

  /* Either the visitor asked for it, or this isn't a YouTube URL we can read
     an id out of — better a plain iframe than a dead poster. Still deferred
     until it's near the viewport in the second case. */
  if (playing || !poster) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        <iframe
          src={playing ? autoplayUrl(url) : url}
          title={caption}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
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
  );
}
