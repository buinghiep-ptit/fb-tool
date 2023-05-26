import DragHandleIcon from '@mui/icons-material/DragHandle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  DialogActions,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import { updateLogoOrder } from 'app/apis/logos/logos.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
  list: any
}

const DialogSortProcesses = React.forwardRef((props: Props, ref) => {
  const { isLoading, setIsLoading, refresh, list } = props

  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
  }

  const [exList, setExList] = useState<any>([])

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(exList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setExList(items)
  }

  useEffect(() => {
    setExList(list)
  }, [list])

  const onSubmit = async () => {
    setIsLoading(true)

    const payload = {
      priorityMap: Object.fromEntries(
        exList.map((i: any, index: any) => [i.id, index + 1]),
      ),
    }

    console.log(payload)
    await updateLogoOrder(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
        refresh()
        handleClose()
      })
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        {isLoading && (
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: '0',
              left: '0',
              zIndex: '1000',
            }}
          >
            <LinearProgress />
          </Box>
        )}
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Sắp xếp diễn biến</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="processes">
              {provided => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {exList.map((item: any, index: any) => {
                    return (
                      <Draggable
                        key={item?.id}
                        draggableId={'' + item?.id}
                        index={index}
                      >
                        {provided => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItemIcon>
                              <DragHandleIcon />
                            </ListItemIcon>
                            <ListItemAvatar sx={{ background: 'tomato', p: 1 }}>
                              <img
                                src={item.logo}
                                height="60px"
                                style={{ objectFit: 'contain' }}
                              ></img>
                            </ListItemAvatar>
                          </ListItem>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
            Đóng
          </Button>
          <Button
            onClick={onSubmit}
            autoFocus
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DialogSortProcesses
