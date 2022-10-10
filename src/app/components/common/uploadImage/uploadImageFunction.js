export const uploadFile = async files => {
  const fileUpload = [...files].map(file => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = window.localStorage.getItem('accessToken')
      const res = axios({
        method: 'post',
        url: 'https://dev09-api.campdi.vn/upload/api/image/upload',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      return res
    } catch (e) {
      console.log(e)
    }
  })

  const response = await Promise.all(fileUpload)
  if (response) return response.map(item => item.data.url)
}
