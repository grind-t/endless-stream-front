import { LinearProgress, Typography } from '@mui/material'
import { Box, SxProps, Theme } from '@mui/system'
import { useCallback, useState } from 'react'
import { io } from 'socket.io-client'
import YTPlayer from 'yt-player'

interface MediaRequest {
  user: string
  videoId: string
  videoTitle: string
}

interface MediaShareProps {
  width?: number
  height?: number
  sx?: SxProps<Theme>
}

function MediaShare({ width, height, sx }: MediaShareProps) {
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const initPlayer = useCallback((playerNode) => {
    if (!playerNode) return
    const player = new YTPlayer(playerNode, {
      width,
      height,
      autoplay: true,
      captions: false,
      controls: false,
      annotations: false,
      modestBranding: true,
      related: false,
      host: 'https://www.youtube-nocookie.com',
      timeupdateFrequency: 100,
    })
    const socket = io()
    socket.on('connect', () => console.log('connected'))
    socket.on('media/changed', (req: MediaRequest | undefined) => {
      if (!req) return setIsVisible(false)
      player.load(req.videoId, true)
      setVideoTitle(req.videoTitle)
    })
    player.on('timeupdate', (seconds) => {
      const percentage = seconds / player.getDuration()
      setProgress(percentage * 100)
    })
    player.on('ended', () => socket.emit('media/ended'))
    player.on('buffering', () => setIsVisible(true))
  }, [])

  return (
    <Box
      sx={{
        position: 'relative',
        visibility: isVisible ? 'visible' : 'hidden',
        lineHeight: 0,
        ...sx,
      }}
    >
      <Box ref={initPlayer} />
      <LinearProgress
        variant="determinate"
        color="primary"
        sx={{ height: 25, opacity: 0.8, boxShadow: 3 }}
        value={progress}
      />
      <Typography
        sx={{
          position: 'absolute',
          bottom: 5,
          left: 5,
          lineHeight: 1,
          color: 'primary.contrastText',
        }}
      >
        {videoTitle}
      </Typography>
    </Box>
  )
}

export default MediaShare
