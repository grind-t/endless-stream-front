import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import YTPlayer from 'yt-player'

interface MediaRequest {
  user: string
  videoId: string
  videoTitle: string
}

interface MediaShareProps {
  width: number
  height: number
  className?: string
}

function MediaShare({ width, height, className }: MediaShareProps) {
  const [player, setPlayer] = useState<YTPlayer>()
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
    setPlayer(player)
  }, [])

  useEffect(() => {
    if (!player) return
    const socket = io()
    const handleMediaChange = (req?: MediaRequest) => {
      if (!req) return setIsVisible(false)
      player.load(req.videoId, true)
      setVideoTitle(req.videoTitle)
    }
    player.on('buffering', () => setIsVisible(true))
    player.on('timeupdate', (seconds) => {
      const percentage = seconds / player.getDuration()
      setProgress(percentage * 100)
    })
    player.on('ended', () => socket.emit('media/ended'))
    socket.on('media/changed', handleMediaChange)
    return () => {
      socket.off('media/changed', handleMediaChange)
      player.destroy()
    }
  }, [player])

  useEffect(() => {
    if (!player) return
    player.setSize(width, height)
  }, [player, width, height])

  return (
    <div className={clsx(isVisible ? 'visible' : 'invisible', className)}>
      <div ref={initPlayer} />
      <div className="bg-sky-50 opacity-95 shadow">
        <div
          className="px-2 bg-gradient-to-r from-sky-300 to-sky-300 bg-no-repeat font-semibold transition-all duration-100 ease-linear"
          style={{ backgroundSize: progress + '%' }}
        >
          {videoTitle}
        </div>
      </div>
    </div>
  )
}

export default MediaShare
