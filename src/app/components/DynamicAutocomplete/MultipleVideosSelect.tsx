import { Autocomplete, TextField } from '@mui/material'
import { getVideos } from 'app/apis/videos/video.service'
import * as React from 'react'
import { useState } from 'react'

export default function MultipleVideosSelect(props: any) {
  const { label, selectedArr, setSelectedArr } = props

  const [options, setOptions] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const fetchOptions = async () => {
    if (loading === true) return undefined

    setLoading(true)
    await getVideos({
      search: query,
      page: 0,
      size: 20,
    })
      .then(res => {
        setOptions(
          res.content.map((item: any) => {
            return {
              id: '' + item.id,
              label: item.title,
            }
          }),
        )
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => setLoading(false), 3000)
      })
  }

  const handleAutocompleteTextChange = (event: any) => {
    setQuery(event?.target?.value)
  }

  React.useEffect(() => {
    if (query && query.length > 3) fetchOptions()
  }, [query])

  React.useEffect(() => {
    fetchOptions()
  }, [])

  React.useEffect(() => {
    if (selectedArr.length === 0) fetchOptions()
  }, [selectedArr])

  return (
    <Autocomplete
      multiple
      loading={loading}
      value={selectedArr}
      onChange={(event: any, newValue: any[]) => {
        setSelectedArr(newValue)
      }}
      id="selectedArr"
      noOptionsText="Không có video nào"
      options={options ?? []}
      getOptionDisabled={option =>
        selectedArr.map((i: any) => i.id + '').includes(option.id + '')
      }
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          value={query}
          onChange={handleAutocompleteTextChange}
          margin="normal"
        />
      )}
    />
  )
}
