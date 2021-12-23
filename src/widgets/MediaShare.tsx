import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

enum MediaType {
  Video,
  Playlist,
}

interface Media {
  id: string
  title: string
  type: MediaType
}

interface MediaShareProps {
  width: number
  height: number
  className?: string
}

function loadYT(): Promise<void> {
  const isLoaded = window.YT && typeof window.YT.Player === 'function'
  if (isLoaded) return Promise.resolve()
  const loading = new Promise<void>((resolve) => {
    // @ts-ignore
    const prevHandler = window.onYouTubeIframeAPIReady
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevHandler === 'function') prevHandler()
      resolve()
    }
  })
  const apiUrl = 'https://www.youtube.com/iframe_api'
  let script = document.querySelector<HTMLScriptElement>(
    `script[src='${apiUrl}']`
  )
  if (script) return loading
  script = document.createElement('script')
  script.src = apiUrl
  const firstScript = document.querySelector('script')
  // @ts-ignore
  firstScript.parentNode.insertBefore(script, firstScript)
  return loading
}

function MediaShare({ width, height, className }: MediaShareProps) {
  const [player, setPlayer] = useState<YT.Player>()
  const [media, setMedia] = useState<Media>()
  const [progress, setProgress] = useState<number>(0)

  const initPlayer = useCallback(async (playerNode) => {
    if (!playerNode) return
    await loadYT()
    const player = new YT.Player(playerNode, {
      width,
      height,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 1,
        controls: 0,
        enablejsapi: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
      },
    })
    const handlePlayerReady = () => {
      player.removeEventListener('onReady', handlePlayerReady)
      setPlayer(player)
    }
    player.addEventListener('onReady', handlePlayerReady)
  }, [])

  useEffect(() => {
    if (!player) return
    const socket = io()
    const timerId = setInterval(() => {
      const percentage = player.getCurrentTime() / player.getDuration()
      setProgress(percentage * 100)
    }, 100)
    const handleStateChange = (e: YT.OnStateChangeEvent) => {
      if (e.data === YT.PlayerState.ENDED) socket.emit('media/ended')
    }
    const handleError = () => {
      socket.emit('media/ended')
    }
    player.addEventListener('onStateChange', handleStateChange)
    player.addEventListener('onError', handleError)
    socket.on('media/changed', setMedia)
    return () => {
      clearInterval(timerId)
      player.removeEventListener('onStateChange', handleStateChange)
      player.removeEventListener('onError', handleError)
      socket.off('media/changed', setMedia)
    }
  }, [player])

  useEffect(() => {
    if (!player) return
    player.setSize(width, height)
  }, [player, width, height])

  useEffect(() => {
    if (!player || !media) return
    if (media.type === MediaType.Video) player.loadVideoById(media.id)
    else player.loadPlaylist({ listType: 'playlist', list: media.id })
  }, [player, media])

  return (
    <div className={className}>
      <div ref={initPlayer} />
      <div className="absolute left-0 bottom-0 bg-slate-400">
        <div
          className="px-2 bg-gradient-to-r from-slate-50 to-slate-50 bg-no-repeat font-semibold transition-all duration-100 ease-linear"
          style={{ backgroundSize: progress + '%' }}
        >
          {media && media.title}
        </div>
      </div>
    </div>
  )
}

export default MediaShare
