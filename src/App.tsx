import backgroundUrl from './background.png'
import MediaShare from './widgets/MediaShare'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(false)

  useEffect(() => {
    const socket = io()
    socket.on('media/changed', (req) => setIsMediaPlaying(!!req))
  }, [])

  return (
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        '::before': {
          content: '""',
          position: 'fixed',
          width: 'inherit',
          height: 'inherit',
          backgroundImage: `url(${backgroundUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          filter: isMediaPlaying ? 'brightness(0.5)' : undefined,
          transition: 'filter 1s',
        },
      }}
    >
      <MediaShare width={854} height={480} />
    </Box>
  )
}

export default App
