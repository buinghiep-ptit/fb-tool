import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'
interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogCreateMatch = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [focusedTeam, setFocusedTeam] = React.useState<any>()
  const params = useParams()
  const [page, setPage] = React.useState(0)
  const [countTable, setCountTable] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const [doRerender, setDoRerender] = React.useState(false)

  const [teams, setTeams] = React.useState<any>()
  const [nameFilter, setNameFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState(99)
  const [typeFilter, setTypeFilter] = React.useState(false)

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

  const schema = yup
    .object({
      idTeamA: yup.string().required('Giá trị bắt buộc'),
      idTeamB: yup.string().required('Giá trị bắt buộc'),
      dateStart: yup.string(),
      status: yup.string(),
      stadium: yup.string(),
      goalForTeamA: yup.string(),
      goalForTeamB: yup.string(),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      idTeamA: '',
      idTeamB: '',
      dateStart: '',
      status: '',
      stadium: '',
      goalForTeamA: '',
      goalForTeamB: '',
    },
  })

  return (
    <div>
      <Dialog open={open} maxWidth="xl">
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Chọn đội bóng tham gia giải đấu</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogCreateMatch
