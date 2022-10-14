export const transformArray = (
  arrOriginal: any[],
  prevKey: string,
  nextKey: string,
) => {
  const targetArray = arrOriginal.map(({ prevKey, ...rest }) => ({
    [nextKey]: prevKey,
    ...rest,
  }))

  return targetArray ?? []
}
