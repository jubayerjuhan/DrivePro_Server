import SibApiV3Sdk from "sib-api-v3-sdk";
import "dotenv/config";

export const sendEmail = async (to, templateId, params, attachment) => {
  return new Promise((resolve, reject) => {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SIB_API_KEY;
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = to;
    sendSmtpEmail.replyTo = {
      email: "jubayerjuhan.info@gmail.com",
      name: "Jubayer Juhan",
    };
    sendSmtpEmail.params = params;
    sendSmtpEmail.attachment = attachment;
    sendSmtpEmail.templateId = templateId;
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        resolve(`Email Sent ${JSON.stringify(data)}`);
      },
      function (error) {
        reject(error);
      }
    );
  });
};
