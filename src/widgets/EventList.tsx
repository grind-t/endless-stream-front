import { HeartIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

enum EventType {
  Follow,
  Sub,
  Donation,
}

interface EventListItem {
  id: number
  user: string
  event: EventType
  payload?: string
}

interface EventIconProps {
  event: EventType
  className?: string
}

function EventIcon({ event, className }: EventIconProps) {
  return <HeartIcon className={className} />
}

interface EventListProps {
  className?: string
}

function EventList({ className }: EventListProps) {
  const [items, setItems] = useState<EventListItem[]>([])

  useEffect(() => {
    const socket = io()
    socket.on('event-list/changed', setItems)
    return () => {
      socket.off('event-list/changed', setItems)
    }
  }, [])

  return (
    <div className={clsx('flex flex-col space-y-2 min-w-[200px]', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center space-x-2 px-2 py-1 rounded shadow shadow-gray-400 -skew-x-12 bg-gray-700/80 text-white animate-fadeInRight"
        >
          <EventIcon event={item.event} className="w-5 h-5 skew-x-12" />
          <span className="skew-x-12">{item.user}</span>
        </div>
      ))}
    </div>
  )
}

export default EventList
