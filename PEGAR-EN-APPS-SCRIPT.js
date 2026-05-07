// =====================================================================
// EL CARTERO — GOOGLE APPS SCRIPT
// =====================================================================
// INSTRUCCIONES:
//   1. Selecciona TODO este código (Ctrl + A)
//   2. Cópialo (Ctrl + C)
//   3. Ve a tu Google Sheet → Extensiones → Apps Script
//   4. Borra lo que haya y pega (Ctrl + V)
//   5. Guarda (Ctrl + S)
//   6. Clic en "Implementar" → "Nueva implementación"
//      - Tipo: Aplicación web
//      - Ejecutar como: Yo (tu cuenta)
//      - Quién tiene acceso: Cualquier usuario
//   7. Clic en "Implementar" → COPIA la URL que aparece
//   8. Pega esa URL en main-cart.liquid donde dice:
//      const SHEETS_URL = 'TU_URL_DE_APPS_SCRIPT_AQUI';
// =====================================================================

const SPREADSHEET_ID = '1UXN5mxHBCOEIBZqTz_hWg1FUIcuHE0pY9qNzhEDMO2Q';
const SHEET_NAME     = 'Pedidos';
const SECRET_TOKEN   = 'EC2026RD'; // Debe coincidir con el token en main-cart.liquid

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Validación de token de seguridad
    if (data._token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Token inválido' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      crearEncabezados(sheet);
    }

    sheet.appendRow([
      data.orderNum  || '',
      data.fecha     || new Date().toLocaleString('es-DO'),
      data.nombre    || '',
      data.apellido  || '',
      data.email     || '',
      data.telefono  || '',
      data.pais      || '',
      data.direccion || '',
      data.ciudad    || '',
      data.provincia || '',
      data.productos || '',
      data.total     || '',
      data.notas     || '',
      'Pendiente'
    ]);

    aplicarFormato(sheet, sheet.getLastRow());

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderNum: data.orderNum }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'OK', mensaje: 'El Cartero — Apps Script activo ✅' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function crearEncabezados(sheet) {
  const headers = [
    '# Pedido', 'Fecha', 'Nombre', 'Apellido', 'Email', 'WhatsApp',
    'País', 'Dirección', 'Ciudad', 'Provincia',
    'Productos', 'Total', 'Notas', 'Estado'
  ];

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range
    .setBackground('#1c1917')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(10)
    .setFontFamily('Arial')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);

  const widths = [130, 160, 100, 100, 180, 140, 110, 220, 120, 120, 280, 90, 200, 110];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

function aplicarFormato(sheet, row) {
  const range = sheet.getRange(row, 1, 1, 14);
  range.setBackground(row % 2 === 0 ? '#fdf8f0' : '#ffffff');
  range.setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');
  sheet.setRowHeight(row, 38);
  sheet.getRange(row, 1).setFontWeight('bold');
  sheet.getRange(row, 12).setFontWeight('bold').setFontSize(11);
  sheet.getRange(row, 14)
    .setBackground('#fff3e0')
    .setFontColor('#e65100')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}
