import moment from "moment";
import path from "path";
import { generateInvoice } from "../../../invoice/generate_invoice/generateInvoice.js";
import { sendEmail } from "../../../middlewares/email/sendEmail.js";
import { addFortnightlyPayment } from "../fortnightly_payment/fortnightly_payment_controller.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
this function generates a fortnightly pdf payment report with ejs
@param {Object<Instructor>} Instructor - The Instructor Object 
@param {Array<Earning>} Earning - An array of Earning objects representing the earnings for the specified period.
@returns {Promise} A promise that resolves with the generated PDF report.
@throws {Error} - Throws an error if anything wrong happens
*/
export const generateAndSendFortnightReportPDF = async (
  instructor,
  earnings,
  breakdown
) => {
  const data = {
    customerName: `${instructor.firstName} ${instructor.lastName}`,
    customerAbn: instructor?.abnNumber,
    customerAddress: instructor?.invoiceAddress,
    invoiceId: 12028930389233,
    date: moment().format("DD MMMM YYYY"),
    managementFee: breakdown.managementFee,
    subtotal: breakdown.subtotal,
    gst: breakdown.gst,
    total: breakdown.total,
    inclusiveGst: breakdown.inclusiveGst,
    bookingAmount: breakdown.bookingAmount,
    items: earnings.map((earning) => ({
      ...earning.toObject({ getters: true }),
      date: moment(earning?.createdAt).format("DD MMMM YYYY"),
      description: `#${earning?.bookingId} - ${earning.bookingType} - ${
        earning.learner?.firstName + earning.learner?.lastName
      }`,
    })),
  };

  // the path where the ejs file located for this pdf
  const ejsPath = path.join(
    __dirname,
    "../../../invoice/ejs/fortnightly_report.ejs"
  );

  return new Promise(async (resolve, reject) => {
    // return console.log(instructor.email, "instructor");
    try {
      // generating the invoice through pdf maker
      const invoice = await generateInvoice(data, ejsPath);
      /**
       * generating the fortnightly payment to the database with
       * fortnightly_payment_model
       **/
      try {
        await addFortnightlyPayment(invoice, instructor?._id, breakdown);
      } catch (error) {
        // rejecting the promise with error if we can't add the fortnightly payment on database
        reject(error);
      }

      try {
        // sending the generated report PDF to instructor by email
        await sendEmail(
          [{ name: instructor?.firstName, email: instructor?.email }],
          10,
          {
            instructorName: instructor.firstName,
            date: moment().format("DD MMMM YYYY"),
          },
          [
            {
              url: invoice,
              name: `Fortnightly Report ${moment().format("DD MMMM YYYY")}.pdf`,
            },
          ]
        );
        resolve(invoice);
      } catch (error) {
        // reject the promise if the email sending is false
        reject(error);
      }
    } catch (error) {
      // reject the error if invoice generating failed
      reject(error);
    }
  });
};
