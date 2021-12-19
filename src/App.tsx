import EventList from './widgets/EventList'
import MediaShare from './widgets/MediaShare'

function App() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr] w-screen h-screen bg-[url('/background.png')] bg-cover">
      <MediaShare
        width={1280}
        height={720}
        className="col-start-2 row-start-2"
      />
      <EventList className="col-start-3 row-start-2 row-span-2 mt-auto mr-4 ml-auto mb-3" />
    </div>
  )
}

export default App
