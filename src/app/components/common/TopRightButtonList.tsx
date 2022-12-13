import { Icon, Stack } from '@mui/material'
import * as React from 'react'
import { MuiButton } from './MuiButton'

export interface Props {
  isLoading?: boolean
  onSave?: () => void
  onCancel?: () => void
  onDelete?: () => void
  onGoBack?: () => void
}

export function TopRightButtonList({
  isLoading = false,
  onSave,
  onCancel,
  onDelete,
  onGoBack,
}: Props) {
  return (
    <Stack
      flexDirection={'row'}
      gap={2}
      sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
    >
      <MuiButton
        title="Lưu"
        disabled={isLoading}
        variant="contained"
        color="primary"
        type="submit"
        onClick={onSave}
        startIcon={<Icon>done</Icon>}
      />
      {onCancel && (
        <MuiButton
          title="Huỷ"
          variant="contained"
          color="warning"
          onClick={onCancel}
          startIcon={<Icon>cached</Icon>}
        />
      )}

      {onDelete && (
        <MuiButton
          title="Xoá"
          variant="contained"
          color="error"
          onClick={onDelete}
          startIcon={<Icon>delete</Icon>}
        />
      )}
      <MuiButton
        title="Quay lại"
        variant="contained"
        color="inherit"
        onClick={onGoBack}
        startIcon={<Icon>keyboard_return</Icon>}
      />
    </Stack>
  )
}
