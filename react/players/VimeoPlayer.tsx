import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import type { VideoPlayer } from '../VideoTypes'

const CSS_HANDLES = ['videoContainer', 'videoElement'] as const

// https://regex101.com/r/wdKKHO/1
const VIMEO_REGEX = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/

function VimeoPlayer({
  width,
  height,
  autoPlay,
  loop,
  playsInline,
  src,
  description,
  classes,
}: VideoPlayer) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const params = `autoplay=${autoPlay}&loop=${loop}&playsinline=${Boolean(
    playsInline
  )}&enablejsapi=1&iv_load_policy=3&modestbranding=1`

  const matchedSrc = src.match(VIMEO_REGEX)
  const videoId = matchedSrc?.[5]

  return (
    <div className={`relative ${handles.videoContainer}`}>
      <iframe
        data-testid="vimeo-player"
        width={width}
        height={height}
        title={description}
        className={`${handles.videoElement}`}
        src={`https://player.vimeo.com/video/${videoId}?${params}`}
        frameBorder="0"
        allowFullScreen
        allow="autoplay"
      />
    </div>
  )
}

export default VimeoPlayer
