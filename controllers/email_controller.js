import SibApiV3Sdk from "sib-api-v3-sdk";
import "dotenv/config";

var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

export const sendEmail = async (templateid, email, name, sms) => {
  sendSmtpEmail = {
    to: [
      {
        email,
        name,
      },
    ],
    templateId: templateid,
    params: {
      SMS: sms,
      FIRSTNAME: name,
    },
  };
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
