import { yupResolver } from '@hookform/resolvers/yup'
import { LinearProgress, MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

const useFormUserModal = (data?: any) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const getContent = (isLoading: boolean) => {
    return (
      <Box
        sx={{
          paddingLeft: {
            xs: '6.66%',
            sm: '13.33%',
          },
          paddingRight: {
            xs: '6.66%',
            sm: '13.33%',
          },
        }}
      >
        <FormProvider {...methods}>
          <Stack gap={3} py={3}>
            <FormInputText
              label={'Email *'}
              type="email"
              name="email"
              placeholder="Nhập Email"
              size="small"
              fullWidth
              defaultValue={(data && data.email) ?? ''}
            />
            <SelectDropDown
              label=" Trạng thái *"
              name="status"
              defaultValue={data?.status ? data?.status : 1}
            >
              <MenuItem value={1}>Hoạt động</MenuItem>
              <MenuItem value={-1}>Không hoạt động</MenuItem>
            </SelectDropDown>

            <SelectDropDown
              label="Nhóm quyền *"
              name="role"
              defaultValue={data?.role ? data?.role : 1}
            >
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>CS</MenuItem>
              <MenuItem value={3}>Sale</MenuItem>
            </SelectDropDown>
          </Stack>
        </FormProvider>
        {isLoading && <LinearProgress />}
      </Box>
    )
  }
  return [getContent, methods] as any
}

export default useFormUserModal
