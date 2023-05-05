import { LinearProgress, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { getMatchDetail } from 'app/apis/matches/matches.service'
import { Breadcrumb, Container } from 'app/components'
import { MATCH_STATUSES } from 'app/constants/matchStatuses'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MatchDetailTabPanel1 from './MatchDetailTabPanel1'
import MatchDetailTabPanel2 from './MatchDetailTabPanel2'
import MatchDetailTabPanel3 from './MatchDetailTabPanel3'

export interface Props {}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

export default function MatchManager(props: Props) {
  const params = useParams()

  const [match, setMatch] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [tab, setTab] = useState(0)

  const handleChangeTab = (event: any, newValue: any) => {
    setTab(newValue)
  }

  const getMatch = async () => {
    setIsLoading(true)
    await getMatchDetail(params.id)
      .then(res => setMatch(res))
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getMatch()
  }, [])

  return (
    <Container>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý thông tin trận đấu', path: '/matches' },
            {
              name: 'Cập nhật thông tin trận đấu',
              path: `/matches/${params.id}`,
            },
          ]}
        />
      </Box>
      {match && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="tabs"
              variant="fullWidth"
            >
              <Tab label="Thông tin chung" {...a11yProps(0)} />
              {match.isCahn &&
                [MATCH_STATUSES.STARTING.id, MATCH_STATUSES.ENDED.id].includes(
                  match.status,
                ) && <Tab label="Diễn biến trận đấu" {...a11yProps(1)} />}
              {match.isCahn &&
                [MATCH_STATUSES.ENDED.id].includes(match.status) && (
                  <Tab label="Thống kê trận đấu" {...a11yProps(2)} />
                )}
            </Tabs>
          </Box>
          <MatchDetailTabPanel1
            value={tab}
            index={0}
            matchId={params.id}
            match={match ?? {}}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            refresh={getMatch}
          />
          <MatchDetailTabPanel2
            value={tab}
            index={1}
            matchId={params.id}
            match={match ?? {}}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <MatchDetailTabPanel3
            value={tab}
            index={2}
            matchId={params.id}
            match={match ?? {}}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </>
      )}
    </Container>
  )
}
