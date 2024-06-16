import  * as nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { Service } from 'typedi';

@Service()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendAssignmentEmail(userEmail: string, userName: string, examCenter: any) {
        const templatePath = path.join(__dirname, '../emailTemplates/assignmentEmail.ejs');
        console.log(templatePath,"----------")
        const html = await ejs.renderFile(templatePath, { userName, examCenter });
        console.log(templatePath)
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: userEmail,
            subject: 'Exam Center Assignment',
            html,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
