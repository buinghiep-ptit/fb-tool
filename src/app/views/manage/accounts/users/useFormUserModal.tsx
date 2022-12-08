import { yupResolver } from '@hookform/resolvers/yup'
import { MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

const useFormUserModal = (data?: any) => {
  const { id } = useParams()
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc')
      .test(
        'validate email',
        'Số ký tự trước @ không thể vượt quá 64',
        email => {
          if (!email?.includes('@')) return true
          return email.split('@')[0].length <= 64
        },
      )
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
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
              disabled={!!id}
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
              <MenuItem value={4}>MKT</MenuItem>
            </SelectDropDown>
          </Stack>
        </FormProvider>
      </Box>
    )
  }
  return [getContent, methods] as any
}

export default useFormUserModal
