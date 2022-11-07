import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import React from 'react'
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

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}
interface CustomizedNavTabsProps {
  navInfo: { path: string; items: { scope: string; label: string }[] }
  id: number | string
  currentTab: number
  data?: any
  setCurrentTab: (tabIdx: number) => void
}

export function NavTabs({
  id,
  currentTab,
  setCurrentTab,
  data,
  ...props
}: CustomizedNavTabsProps) {
  const navigate = useNavigateParams()
  const { navInfo } = props

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
    navigate('', {
      scope: navInfo.items[newValue].scope,
    } as any)
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <StyledTabs
        value={currentTab}
        onChange={handleChange}
        aria-label="styled tabs example"
      >
        {navInfo.items.map((item, index) => (
          <StyledTab
            key={item.scope}
            label={item.label}
            {...a11yProps(index)}
          />
        ))}
      </StyledTabs>
    </Box>
  )
}
