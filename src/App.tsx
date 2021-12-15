import backgroundUrl from './background.png'
import EventList from './widgets/EventList'
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
        gridTemplateAreas: `
        ". . ." 
        ". media events" 
        ". . events"
        `,
        gridTemplateColumns: '1fr auto 1fr',
        gridTemplateRows: '1fr auto 1fr',
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
          zIndex: -1,
        },
      }}
    >
      <MediaShare width={1280} height={720} sx={{ gridArea: 'media' }} />
      <EventList sx={{ gridArea: 'events', mt: 'auto', mr: 3, ml: 'auto' }} />
    </Box>
  )
}

export default App
