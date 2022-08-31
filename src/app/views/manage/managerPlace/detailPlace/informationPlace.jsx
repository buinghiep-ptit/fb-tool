import { Grid, TextField, Autocomplete } from '@mui/material'
import UploadImage from 'app/components/common/uploadImage'
import * as React from 'react'
import Typography from '@mui/material/Typography'

export default function InformationPlace(props) {
  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
  ]

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12}>
          <TextField label="Tên địa danh" variant="outlined" />
        </Grid>
        <Grid item xs={12} md={12} style={{ display: 'flex' }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            sx={{ width: 200, marginRight: 5 }}
            renderInput={params => (
              <TextField {...params} label="Tỉnh/thành phố" margin="normal" />
            )}
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            sx={{ width: 200, marginRight: 5 }}
            renderInput={params => (
              <TextField {...params} label="Xã/Quận huyện" margin="normal" />
            )}
          />
          <TextField label="Địa danh" variant="outlined" margin="normal" />
        </Grid>
        <Grid item xs={12}>
          Vị trí trên bản đồ
        </Grid>
        <Grid item xs={12} md={12}>
          <Autocomplete
            multiple
            options={top100Films}
            getOptionLabel={option => option.label}
            defaultValue={[top100Films[1]]}
            filterSelectedOptions
            sx={{ width: 400, marginRight: 5 }}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Loại hình"
                placeholder="Loại hình"
                fullWidth
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Autocomplete
            multiple
            options={top100Films}
            getOptionLabel={option => option.label}
            defaultValue={[top100Films[1]]}
            filterSelectedOptions
            sx={{ width: 400, marginRight: 5 }}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Hashtag"
                placeholder="Hashtag"
                fullWidth
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            id="outlined-multiline-static"
            label="Mô tả"
            multiline
            rows={10}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
      <Typography>Ảnh:</Typography>
      <UploadImage></UploadImage>
    </>
  )
}
