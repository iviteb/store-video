import React from 'react'

import { VideoPlayer } from './interfaces'
import VimeoPlayer from './players/VimeoPlayer'
import HTML5Player from './players/HTML5Player'
import YoutubePlayer from './players/YoutubePlayer'

const VIMEO_PATTERN = /vimeo/
const YOUTUBE_PATTERN = /youtube|youtu.be/

const Video: StorefrontFunctionComponent<VideoPlayer> = (props) => {
  const { src, name, description, poster, uploadDate } = props
  const isVimeo = VIMEO_PATTERN.test(src)
  const isYoutube = YOUTUBE_PATTERN.test(src)

  const StructuredData = () => {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
          "@context": "http://schema.org",
          "@type": "VideoObject",
          "name": "${name}",
          "description": "${description}",
          "contentUrl": "${src}",
          "uploadDate": ${uploadDate ? new Date(uploadDate) : undefined},
          "thumbnailUrl": "${poster ?? src}",
        }`,
        }}
      />
    )
  }

  let Player = HTML5Player

  if (isVimeo) {
    Player = VimeoPlayer
  }

  if (isYoutube) {
    Player = YoutubePlayer
  }

  return (
    <>
      <StructuredData />
      <Player {...props} />
    </>
  )
}

Video.schema = {
  title: 'admin/editor.video.title',
}

export default Video