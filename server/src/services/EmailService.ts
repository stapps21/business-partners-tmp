require('module-alias/register')
import nodemailer from 'nodemailer';

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendEmail = async (to: string, subject: string, text: string, html: (string | undefined) = undefined) => {
    const mailOptions = {
        from: 'no-reply@business-partners.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    if (process.env.NODE_ENV !== "development") {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email: ', error);
            throw error; // Re-throw the error for further handling
        }
    } else {
        console.log("\n")
        console.log("+============================EMAIL==========================")
        console.log("| From:", mailOptions.from)
        console.log("| To:", mailOptions.to)
        console.log("| Subject:", mailOptions.subject)
        console.log("+------------------------------")
        console.log(mailOptions.text.split('\n').map(line => '| ' + line).join('\n'))
        console.log("+==========================================================")
        console.log("\n")
    }
};
