import { Box, BoxProps } from '@mui/system'
import * as React from 'react'

export interface IProps extends BoxProps {
  children?: React.ReactElement
}

export function AbsoluteFillObject({ children, ...props }: IProps) {
  return (
    <Box
      {...props}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  )
}
