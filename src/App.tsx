import EventList from './widgets/EventList'
import MediaShare from './widgets/MediaShare'

function App() {
  return (
    <>
      <MediaShare width={1920} height={1080} className="absolute -z-50" />
      <EventList className="absolute right-4 bottom-3" />
    </>
  )
}

export default App
