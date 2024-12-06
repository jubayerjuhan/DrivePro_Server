import ejs from "ejs";
import path from "path";
import pdfMaker from "html-pdf-node";
import { gcloudStorage } from "../../index.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**

Object containing invoice information.
@typedef {Object} InvoiceInfo
@property {string} customerName - The full name of the customer.
@property {Array<Object>} items - Array of items in the invoice.
@property {string} items.description - The description of the product.
@property {number} items.quantity - The quantity of the product.
@property {number} items.unitPrice - The unit price of the product.
@property {number} items.amount - The total amount of the product.
@property {number} items.gst - The GST amount of the product.
@property {number} customerAbn - The ABN of the customer.
@property {string} customerAddress - The address of the customer.
@property {number} invoiceId - The unique identifier of the invoice.
@property {string} date - The date when the invoice was issued.
@property {number} managementFee - The management fee for the invoice.
@property {number} subtotal - The subtotal of the invoice.
@property {number} gst - The GST amount of the invoice.
@property {number} total - The total amount of the invoice.
*/
/**

Generates a PDF report for the specified instructor with their earnings information.
@param {string} instructorId - The unique identifier of the instructor.
@param {Array<Payment>} payments - Array of payment objects containing the earnings information.
@returns {Promise<Buffer>} - Returns a Promise that resolves with a PDF buffer.
*/

export const generateInvoice = (data, ejsPath) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(ejsPath, data, (err, html) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const options = { format: "A4" };
        let file = { content: html };

        pdfMaker.generatePdf(file, options).then(async (pdfBuffer) => {
          const invoice = await uploadPdfToBucket(pdfBuffer);
          resolve(invoice);
        });
      }
    });
  });
};

const uploadPdfToBucket = async (buffer) => {
  const fileName = "Earning_Invoice" + Date.now() + ".pdf";
  const bucket = gcloudStorage.bucket(process.env.BUCKET_NAME);
  try {
    await bucket.file(fileName).save(buffer);

    return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.log(error);
    return false;
  }
};
