import { Box } from '@mui/system'
import * as React from 'react'

export interface IBoxWrapperDialogProps {
  children?: React.ReactElement
}

export function BoxWrapperDialog({ children }: IBoxWrapperDialogProps) {
  return (
    <Box
      sx={{
        paddingLeft: {
          xs: '6.66%',
          sm: '13.33%',
        },
        paddingRight: {
          xs: '6.66%',
          sm: '13.33%',
        },
      }}
    >
      {children}
    </Box>
  )
}
