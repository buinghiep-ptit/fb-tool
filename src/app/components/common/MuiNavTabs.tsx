import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { BoxProps } from '@mui/system'
import { useNavigate } from 'react-router-dom'

interface StyledTabsProps {
  children?: React.ReactNode
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 32,
    width: '100%',
    backgroundColor: '#2F9B42',
  },
})

interface StyledTabProps {
  label: string
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: theme.palette.text.primary,
  '&.Mui-selected': {
    color: theme.palette.primary,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}))

interface CustomizedNavTabsProps {
  navItems: string[]
  customerId: number | string
}

export function MuiNavTabs({ customerId, ...props }: CustomizedNavTabsProps) {
  const navigate = useNavigate()
  const { navItems } = props
  const [value, setValue] = useState<number>(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    switch (newValue) {
      case 0:
        navigate(`/quan-ly-tai-khoan-khach-hang/${customerId}/info`, {
          replace: true,
        })
        break
      case 1:
        navigate(`/quan-ly-tai-khoan-khach-hang/${customerId}/history`, {
          replace: true,
        })
        break
      default:
        break
    }
  }

  return (
    // <Box sx={{ width: "100%" }}>
    <Box sx={{ bgcolor: 'transparent' }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="styled tabs example"
      >
        {navItems.map(item => (
          <StyledTab key={item} label={item} />
        ))}
      </StyledTabs>
    </Box>
    // </Box>
  )
}
