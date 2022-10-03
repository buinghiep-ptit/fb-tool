import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Icon,
  Stack,
} from '@mui/material'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiTypography } from 'app/components/common/MuiTypography'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

export interface IButtonsActionProps {}

export function ButtonsActions(props: IButtonsActionProps) {
  const navigate = useNavigate()

  return (
    <Stack flexDirection={'row'}>
      <MuiButton
        title="Còn chỗ"
        variant="outlined"
        color="primary"
        onClick={() =>
          navigate(`con-cho`, {
            state: { modal: true },
          })
        }
        startIcon={<Icon>how_to_reg</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Hết chỗ"
        variant="outlined"
        sx={{ color: '#AAAAAA' }}
        onClick={() =>
          navigate(`het-cho`, {
            state: { modal: true },
          })
        }
        startIcon={<Icon>person_off</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Huỷ"
        variant="outlined"
        color="error"
        startIcon={<Icon>person_remove</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Chuyển tiếp"
        variant="outlined"
        color="warning"
        startIcon={<Icon>cached</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Ghi chú"
        variant="outlined"
        color="warning"
        startIcon={<Icon>event_note</Icon>}
      />
    </Stack>
  )
}
