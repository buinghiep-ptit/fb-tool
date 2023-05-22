const FileSaver = require('file-saver')
import moment from 'moment'
import * as XLSX from 'xlsx'

export type wsConfig = {
  width?: number
  alignment?: { horizontal?: 'center' | 'left' | 'right' }
}

export const ExportToExcel = <T>(
  apiData: T[],
  fileNamePrefix?: string,
  wsColsWidth?: wsConfig[],
) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const fileName = fileNamePrefix + moment(new Date()).format('DDMMYYYY')
  const worksheet = XLSX.utils.json_to_sheet(apiData)

  worksheet['!cols'] = apiData.map((_, index) => ({
    wpx: index === 0 ? 50 : 150,
  }))
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(data, fileName + fileExtension)
}
