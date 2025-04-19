import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail  = async (email, verificationTOken) => {
    const receipt = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipt,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationTOken),
            category: "Email Verification"
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending email", error);
        
        throw new error("Error sending email: ", error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const receipt = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipt,
            template_uuid: "d6023365-60f4-420b-9bf0-f6ee10700742",
            template_variables: {
                "company_info_name": "C Max",
                "name": name,
                "company_info_address": "Seda Uyana,Chilaw",
                "company_info_city": "Chilaw",
                "company_info_zip_code": "61000",
                "company_info_country": "Sri Lanka"
              }
            
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending welcome email", error);
        
        throw new error("Error sending welcome email: ", error);
    }
};

export const sendPasswordResetEmail = async(email, resetURL) => {
    const receipt = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipt,
            subject: "Password Reset Email",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });    

        console.log("Password Reset sent successfully", response);
    } catch (error) {
        console.error("Error sending Password Reset Link ", error);
        
        throw new error("Error sending Password Reset Link ", error);
    }
}

export const sendPasswordResetSuccessMail = async(email) => {
    const receipt = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipt,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });

        console.log("Password Reset Success Email sent successfully", response);
    } catch (error) {
        console.error("Error sending Password Reset Success Email", error);

        throw new error("Error sending Password Reset Success Email", error);
    }
}