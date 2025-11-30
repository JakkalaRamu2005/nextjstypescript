import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export async function sendResetEmail(toEmail: string, resetLink: string){


const mailOptions={
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Password Reset Link",
    html: `<p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
}


try{
    await transporter.sendMail(mailOptions);
    return true;
}catch(error){
    console.error("Error sending reset email:", error);
    return false;
}
}