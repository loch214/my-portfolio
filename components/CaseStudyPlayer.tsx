'use client';

import { RotateCcw, RotateCw } from 'lucide-react';
import { SeekButton } from '@videojs/react';
import { VideoPlayer, VideoSkin } from '@videojs/react/video';
import { YouTubeVideo } from '@videojs/react/media/youtube-video';

interface CaseStudyPlayerProps {
  youtubeId: string;
  caption: string;
  onEnded: () => void;
}

/* The Video.js player itself — split out of VideoEmbed.tsx so its ~85KB of
   JavaScript is only downloaded when a visitor actually presses play (it is
   loaded through next/dynamic there). See VideoEmbed.tsx for why it exists. */
export default function CaseStudyPlayer({ youtubeId: id, caption, onEnded }: CaseStudyPlayerProps) {
  return (
    <VideoPlayer>
      <VideoSkin className="case-study-player" style={{ aspectRatio: '16 / 9' }} aria-label={caption}>
        {/* `youtube/ID` keeps the privacy-enhanced youtube-nocookie host. */}
        <YouTubeVideo
          src={`youtube/${id}`}
          autoplay
          playsInline
          onEnded={onEnded}
        />
        {/* ±10s buttons. The default skin has no slot in its control bar,
            so they sit either side of centre and fade with the controls
            (.case-study-seek in globals.css). */}
        <div className="case-study-seek">
          <SeekButton seconds={-10} aria-label="Back 10 seconds">
            <RotateCcw size={26} strokeWidth={1.75} aria-hidden />
            <span aria-hidden>10</span>
          </SeekButton>
          <SeekButton seconds={10} aria-label="Forward 10 seconds">
            <RotateCw size={26} strokeWidth={1.75} aria-hidden />
            <span aria-hidden>10</span>
          </SeekButton>
        </div>
      </VideoSkin>
    </VideoPlayer>
  );
}
