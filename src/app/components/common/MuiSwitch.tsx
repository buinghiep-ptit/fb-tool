import { styled, Switch } from '@mui/material'
import { Stack, StackProps } from '@mui/system'
import * as React from 'react'

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 22,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(14px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 3,
    '&.Mui-checked': {
      transform: 'translateX(18px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 18,
    height: 18,
    borderRadius: 9,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,.35)'
        : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}))

export interface IMuiSwitchProps extends StackProps {
  checked: boolean
}

export function MuiSwitch({ checked, ...props }: IMuiSwitchProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" {...props}>
      <AntSwitch
        checked={checked}
        inputProps={{ 'aria-label': 'ant design' }}
      />
    </Stack>
  )
}
