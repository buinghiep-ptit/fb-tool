import { styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb } from 'app/components'
import { MuiNavTabs } from 'app/components/common/MuiNavTabs'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))
export interface Props {
  navInfo: {
    rootName?: string
    path: string
    items: { tab: string; label: string }[]
  }
  children?: React.ReactElement
}

export function LayoutWithNavTabs({ navInfo, children }: Props) {
  const getCurrentTabIndex = () => {
    const index = navInfo.items.findIndex(item => pathname.includes(item.tab))
    return index
  }

  const router = useLocation()
  const { pathname } = router
  const [tabName, setTabName] = useState(navInfo.items[0].label)
  const { customerId: id } = useParams() ?? 0
  const [currentTab, setCurrentTab] = useState<number>(getCurrentTabIndex())

  useEffect(() => {
    const idx = getCurrentTabIndex()
    if (idx !== -1) {
      setTabName(navInfo.items[idx].label)
    }
  }, [router])

  return (
    <Container
      navInfo={{
        rootName: undefined,
        path: '',
        items: [],
      }}
    >
      <React.Fragment>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: navInfo.rootName, path: `/${navInfo.path}` },
              // {
              //   name: 'Chi tiết',
              //   path: `/${navInfo.path}/${id ?? 0}`,
              // },
              { name: tabName },
            ]}
          />
        </Box>
        <Box mt={-2} pb={2}>
          <MuiNavTabs
            navInfo={navInfo}
            id={id ?? 0}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </Box>
        {children}
      </React.Fragment>
    </Container>
  )
}
