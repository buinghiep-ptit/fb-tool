export const getColorByCusStatus = (status: number) => {
  switch (status) {
    case 1:
      return '#2F9B42'
    case -1:
      return '#AAAAAA'

    case -2:
      return '#FF3D57'

    case -3:
      return '#ff9e43'

    default:
      return '#AAAAAA'
  }
}
