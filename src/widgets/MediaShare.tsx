import { Box } from '@mui/system'
import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import YTPlayer from 'yt-player'

interface MediaRequest {
  user: string
  videoId: string
  videoTitle: string
}

function MediaShare() {
  const playerRef = useRef<HTMLElement>()
  const playerElem = playerRef.current
  const player = useMemo(
    () =>
      playerElem &&
      new YTPlayer(playerElem, {
        autoplay: true,
        controls: false,
        captions: false,
        annotations: false,
        related: false,
      }),
    [playerElem]
  )
  const [media, setMedia] = useState<MediaRequest>()

  useEffect(() => {
    const socket = io()
    socket.on('connect', () => console.log('connected'))
    socket.on('media/changed', setMedia)
  }, [])

  useEffect(() => {
    if (!player || !media) return
    player.load(media.videoId, true)
  }, [player, media])

  return <Box ref={playerRef} />
}

export default MediaShare
