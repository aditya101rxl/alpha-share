import nodemailer from 'nodemailer'
import _env from 'dotenv'
import bcrypt from 'bcryptjs'
_env.config()

export const getOTP = async (targetEmail) => {

    console.log(targetEmail);
    let regex = /^([a-z0-9\.-_]+)@([a-z0-9]+).([a-z]{2,7})(.[a-z]{2,7})?$/;
    if (regex.test(targetEmail)) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.USER_PASS
            }
        });
        const randomInt = () => {
            let low = 100000, high = 999999;
            return Math.floor(Math.random() * (high - low + 1) + low);
        }
        let otp = randomInt();
        var mailOptions = {
            from: 'no-replay@gmail.com',
            to: targetEmail,
            subject: 'email verification OTP',
            html: `<img src='' alt='miligram logo'>
                    <h4> Welcome... </h4>
                    <p> 
                        Your otp for email verification is 
                        <span style="color:crimson">${otp}</span>
                    </p>
                    <p>
                        Enjoy using this web application to share memes among your friends.
                    </p>
                    <p>
                        Thankyou, for being a user of this web applications.
                    </p>`
        };
        await transporter.sendMail(mailOptions, (error, info)=>{
            if(error) console.log(error);
            else console.log(info.response)
        });
        return otp;
    } else {
        return 0;
    }
}


export const encrypt = async (password) => {
    const hashed_password = await bcrypt.hash(password, 10);
    return hashed_password;
}

export const compare = async (password, hashed_password) => {
    const password_matched =  await bcrypt.compare(password, hashed_password);
    return password_matched;
}