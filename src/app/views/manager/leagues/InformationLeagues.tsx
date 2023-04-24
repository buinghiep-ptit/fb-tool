import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Container, SimpleCard } from 'app/components'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
export interface Props {}
export default function InfomationLeagues(props: Props) {
  const navigate = useNavigate()
  const param = useParams()

  const schema = yup
    .object({
      name: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      shortNAme: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      logo: yup.string().required('Giá trị bắt buộc'),
      status: yup
        .number()
        .required('Gía trị bắt buộc')
        .typeError('Giá trị bắt buộc'),
      type: yup
        .number()
        .required('Giá trị bắt buộc')
        .typeError('Giá trị bắt buộc'),
      category: yup
        .number()
        .required('Giá trị bắt buộc')
        .typeError('Giá trị bắt buộc'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      shortName: '',
      type: null,
      category: null,
      status: null,
      isDisplayRank: false,
      isDisplaySchedule: false,
    },
  })

  const onSubmit = async (data: any) => {
    console.log(data)
  }

  return (
    <Container>
      <SimpleCard title="Thêm thông tin giải đấu">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      error={!!methods.formState.errors?.name}
                      helperText={methods.formState.errors?.name?.message}
                      {...field}
                      label="Tên giải đấu*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="shortName"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      error={!!methods.formState.errors?.shortName}
                      helperText={methods.formState.errors?.shortName?.message}
                      {...field}
                      label="Tên viết tắt*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="type"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="demo-simple-select-label">
                        Loại giải*
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Tình trạng hôn nhân"
                      >
                        <MenuItem value={99}>Tất cả</MenuItem>
                        <MenuItem value={1}>Bóng đá nam</MenuItem>
                        <MenuItem value={2}>Bóng đá nữ</MenuItem>
                        <MenuItem value={3}>Futsal</MenuItem>
                        <MenuItem value={4}>Bóng đá bãi biển</MenuItem>
                        <MenuItem value={5}>Phong trào cộng đồng</MenuItem>
                        <MenuItem value={6}>Khác</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.type?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="category"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="demo-simple-select-label">
                        Thể Loại*
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Tình trạng hôn nhân"
                      >
                        <MenuItem value={1}>Leagues</MenuItem>
                        <MenuItem value={2}>Cup</MenuItem>
                        <MenuItem value={3}>Khác</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.category?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.category.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="status"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="demo-simple-select-label">
                        Trạng thái*
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Tình trạng hôn nhân"
                      >
                        <MenuItem value={0}>Chưa diễn ra</MenuItem>
                        <MenuItem value={1}>Đang diễn ra</MenuItem>
                        <MenuItem value={-1}>Kết thúc</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.status?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.status.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <MuiCheckBox
                  name="isDisplayRank"
                  label="Hiển thị BXH trên tràng chủ*"
                />
                <MuiCheckBox
                  name="isDisplaySchedule"
                  label="Hiển thị lịch đấu trên website*"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  style={{ padding: '12px 20px' }}
                >
                  Lưu
                </Button>
                <Button
                  style={{ marginLeft: '15px', padding: '12px 20px' }}
                  color="primary"
                  variant="contained"
                  disabled={isLoading}
                  onClick={() => {
                    navigate('/players')
                  }}
                >
                  Quay lại
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
