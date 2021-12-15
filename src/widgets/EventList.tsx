import FavoriteIcon from '@mui/icons-material/Favorite'
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  SxProps,
  Theme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
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
}

function EventIcon({ event }: EventIconProps) {
  return <FavoriteIcon />
}

interface EventListProps {
  sx?: SxProps<Theme>
}

function EventList({ sx }: EventListProps) {
  const [items, setItems] = useState<EventListItem[]>([])

  useEffect(() => {
    const socket = io()
    socket.on('event-list/changed', setItems)
    return () => {
      socket.off('event-list/changed', setItems)
    }
  }, [])

  return (
    <List sx={{ minWidth: 150, ...sx }}>
      <TransitionGroup>
        {items.map((item) => (
          <Collapse key={item.id}>
            <ListItem
              disablePadding
              sx={{
                my: 0.5,
                py: 0.5,
                pr: 3,
                pl: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                transform: 'skew(-15deg)',
                boxShadow: 3,
              }}
            >
              <ListItemIcon sx={{ transform: 'skew(15deg)' }}>
                <EventIcon event={item.event} />
              </ListItemIcon>
              <ListItemText
                primary={item.user}
                sx={{ transform: 'skew(15deg)' }}
              />
            </ListItem>
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  )
}

export default EventList
