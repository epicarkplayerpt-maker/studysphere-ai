import pdfParse from 'pdf-parse';

console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys of pdfParse:', Object.keys(pdfParse || {}));
console.log('pdfParse keys/properties:', Object.getOwnPropertyNames(pdfParse || {}));

if (pdfParse && (pdfParse as any).default) {
  console.log('Default export keys:', Object.keys((pdfParse as any).default));
}
