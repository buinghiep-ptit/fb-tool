import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export interface RankIconProps extends SvgIconProps {
  rank: number
}

const RankIcon: React.FC<RankIconProps> = props => {
  const { rank, className } = props

  return (
    <SvgIcon {...props}>
      {/* Nội dung bên trong biểu tượng */}
      <path d="M12 2 L15.09 8.39 L22 9.6 L17 14.62 L18.18 21.5 L12 18.77 L5.82 21.5 L7 14.62 L2 9.6 L8.91 8.39 L12 2" />
      {/* Nội dung hiển thị vị trí */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="10"
        color="white"
      >
        {rank}
      </text>
    </SvgIcon>
  )
}

export default RankIcon
