export const extractMergeFiltersObject = (
  prevFilters: Record<string, any>,
  curFilters: Record<string, any>,
) => {
  const mergeFilters: Record<string, any> = {
    ...prevFilters,
    ...curFilters,
  }
  Object.keys(mergeFilters).forEach(key => {
    if (
      mergeFilters[key] === 'all' ||
      mergeFilters[key] === '' ||
      mergeFilters[key] === undefined ||
      (typeof mergeFilters[key] === 'boolean' && !mergeFilters[key])
    )
      delete mergeFilters[key]
    if (typeof mergeFilters[key] === 'boolean' && mergeFilters[key])
      mergeFilters[key] = 1
  })
  return mergeFilters
}
