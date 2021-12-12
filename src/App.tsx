import backgroundUrl from './background.png'
import MediaShare from './widgets/MediaShare'
import { Box } from '@mui/system'

function App() {
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
          filter: 'brightness(0.9)',
        },
      }}
    >
      <MediaShare width={854} height={480} />
    </Box>
  )
}

export default App
