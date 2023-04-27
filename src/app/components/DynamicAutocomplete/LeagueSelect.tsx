import { Autocomplete, TextField } from '@mui/material'
import { getLeagues } from 'app/apis/leagues/leagues.service'
import * as React from 'react'
import { useState } from 'react'

export default function LeagueSelect(props: any) {
  const { label, selectedLeague, setSelectedLeague } = props

  const [options, setOptions] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const fetchListLeagues = async () => {
    if (loading === true) return undefined

    setLoading(true)
    await getLeagues({
      name: query,
      page: 0,
      size: 20,
    })
      .then(res => {
        setOptions(
          res.content.map((item: any) => {
            return {
              id: '' + item.id,
              label: item.name,
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
    if (query && query.length > 3) fetchListLeagues()
  }, [query])

  React.useEffect(() => {
    if (selectedLeague == null) fetchListLeagues()
  }, [selectedLeague])

  return (
    <Autocomplete
      loading={loading}
      value={selectedLeague}
      onChange={(event: any, newValue: string | null) => {
        setSelectedLeague(newValue)
      }}
      id="selectedLeague"
      options={options ?? []}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          value={query}
          onChange={handleAutocompleteTextChange}
        />
      )}
    />
  )
}
