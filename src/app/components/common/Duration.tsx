import React from 'react'
import { MuiTypography } from './MuiTypography'

export default function Duration({ className, seconds }: any) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      <MuiTypography fontSize={'0.75rem'} color="primary">
        {format(seconds)}
      </MuiTypography>
    </time>
  )
}

function format(seconds: number) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad(string: number) {
  return ('0' + string).slice(-2)
}
