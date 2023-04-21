import { Box, styled } from '@mui/material'
import { MatxLogo } from 'app/components'
import useSettings from 'app/hooks/useSettings'
import { Span } from './Typography'

const BrandRoot = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 18px 20px 29px',
}))

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 24,
  marginLeft: '.5rem',
  fontFamily: 'Caveat',
  fontWeight: 700,
  display: mode === 'compact' ? 'none' : 'block',
}))

const Brand = ({ children }) => {
  const { settings } = useSettings()
  const leftSidebar = settings.layout1Settings.leftSidebar
  const { mode } = leftSidebar

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <img src="/assets/images/logo.svg" alt="" />
        {/* <MatxLogo /> */}
        <StyledSpan mode={mode} className="sidenavHoverShow">
          CAHN
        </StyledSpan>
      </Box>

      <Box
        className="sidenavHoverShow"
        sx={{ display: mode === 'compact' ? 'none' : 'block' }}
      >
        {children || null}
      </Box>
    </BrandRoot>
  )
}

export default Brand
