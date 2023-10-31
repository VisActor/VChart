import ExcelJS from 'exceljs';

export async function excel2csv(buffer: any) {
  // 从 buffer 加载
  try {
    const workbook = new ExcelJS.Workbook();
    const file = await workbook.xlsx.load(buffer as Buffer);
    let str = '';
    file.eachSheet(sheet => {
      let skipIdxs: number[] = [];
      sheet.eachRow((row, rowIndex) => {
        // 跳过标题非法字段
        if (row.values && rowIndex === 0) {
          skipIdxs = (row.values as any[]).filter((v, i) => v || i);
        }
        const values = (row.values as any[]).filter((_, i) => !skipIdxs.includes(i));
        str += values.toString() + '\n';
      });
    });
    return str;
  } catch (err) {
    console.log('转换出错', err);
  }
}
