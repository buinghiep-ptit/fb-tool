export function checkIfFilesAreTooBig(
  files?: [File & { duration?: number }],
  mediaFormat?: number,
): boolean {
  let valid = true
  if (files && files.length) {
    files.map(file => {
      const size = file.size / 1024 / 1024
      const duration = file.duration
      if (mediaFormat === 1 && duration) {
        if (duration > 180) {
          valid = false
          return
        }
      } else if (mediaFormat === 2) {
        if (size > 10) {
          valid = false
          return
        }
      }
    })
  }
  console.log('valid:', valid)
  return valid
}

export function checkIfFilesAreCorrectType(files?: [File]): boolean {
  let valid = true
  if (files) {
    files.map(file => {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        valid = false
      }
    })
  }
  return valid
}

// const schema = Yup.object().shape({
//   files: Yup.array()
//     .nullable()
//     .required('VALIDATION_FIELD_REQUIRED')
//     .test('is-correct-file', 'VALIDATION_FIELD_FILE_BIG', checkIfFilesAreTooBig)
//     .test(
//       'is-big-file',
//       'VALIDATION_FIELD_FILE_WRONG_TYPE',
//       checkIfFilesAreCorrectType,
//     ),
// })
