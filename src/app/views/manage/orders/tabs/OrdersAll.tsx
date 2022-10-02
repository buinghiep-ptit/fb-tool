import * as React from 'react'

export interface IOrdersAllProps {
  orders?: any
}

export default function OrdersAll({ orders }: IOrdersAllProps) {
  const data = React.useMemo(() => orders, [orders])
  console.log(data)
  return <div>OrdersAll</div>
}
