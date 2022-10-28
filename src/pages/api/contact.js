import nodemailer from 'nodemailer';
export default async (req, res) => {
  const { name, email, reportedNFT, reportMessage } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'humans.reporter@gmail.com',
      pass: "jsasbmshvelepzsv",
    }
  });

  const mailDetails = {
    from: email,
    to: 'support@humans.ai',
    subject: `Item report from ${name}`,
    html: `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p><br>
    <p><strong>Reported NFT:</strong> ${reportedNFT}</p>
    <p><strong>Report message:</strong> ${reportMessage}</p>`
  }
/*
  try {
    const emailResponse = await transporter.sendMail(mailDetails)
    console.log("Report sent", emailResponse.messageId);
  } catch (error) {
    console.log(error);
  }
 */


  transporter.sendMail(mailDetails, function (error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  })
  res.status(200).json(req.body);
  console.log("email sent: ", req.body);
}