import React from 'react'

type Props = {
  loading?: boolean
  className?: any
  style?: any
}

const Loading = ({ loading, className, style }: Props) => {
  if (!loading) {
    return null
  }
  return (
    <div className={`loading ${className}`} style={style}>
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default React.memo(Loading)
