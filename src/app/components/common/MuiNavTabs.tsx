import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleCard from '../SimpleCard'

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

function TabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}
interface CustomizedNavTabsProps {
  navInfo: { path: string; items: { tab: string; label: string }[] }
  id: number | string
  currentTab: number
  data?: any
  setCurrentTab: (tabIdx: number) => void
  children?: ReactElement
}

export function MuiNavTabs({
  id,
  currentTab,
  setCurrentTab,
  data,
  children,
  ...props
}: CustomizedNavTabsProps) {
  const navigate = useNavigate()
  const { navInfo } = props

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
    let path = ''
    if (!id) {
      path = `/${navInfo.path}/${navInfo.items[newValue].tab}`
    } else {
      path = `/${navInfo.path}/${id}/${navInfo.items[newValue].tab}`
    }
    navigate(path, {
      replace: true,
    })
  }

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <StyledTabs
        value={currentTab}
        onChange={handleChange}
        aria-label="styled tabs example"
      >
        {navInfo.items.map((item, index) => (
          <StyledTab key={item.tab} label={item.label} {...a11yProps(index)} />
        ))}
      </StyledTabs>
      {navInfo.items.map((element: any, index: number) => (
        <TabPanel key={element.tab} value={currentTab} index={index}>
          <SimpleCard title="">
            {children}
            {/* {element.element(data)} */}
          </SimpleCard>
        </TabPanel>
      ))}
    </Box>
  )
}
