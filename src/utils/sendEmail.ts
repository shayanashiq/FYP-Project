import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

const OAUTH_EMAIL = process.env.OAUTH_EMAIL;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const OAUTH_ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN;
const DOC_PROFILE_RECEIVER_EMAIL = process.env.DOC_PROFILE_RECEIVER_EMAIL;
const PAT_PROFILE_RECEIVER_EMAIL = process.env.PAT_PROFILE_RECEIVER_EMAIL;

function constructImageUrl(imageName: any, role: string) {
    if (role === "PATIENT") {
        return imageName;
    }
    if (imageName === "" && role === "DOCTOR") {
        return null
    }
    if (imageName === "@/public/logo.png") {
        return null;
    }
    const baseUrl = "https://app.avahealth.ai/_next/image";
    const encodedUrl = encodeURIComponent(`https://app.avahealth.ai/api/download?fileName=${imageName}`);
    const queryParams = `url=${encodedUrl}&w=1920&q=75`;

    return `${baseUrl}?${queryParams}`;

}

function formatDate(dateString: any) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
}






export async function sendEmail(email: string, firstName: string, lastName: string, role: string, id: any) {

    let receiverEmail, Company, Subject, Message;
    if (role == "DOCTOR") {
        const doctor = await prisma.doctorProfile.findUnique({
            where: {
                userId: id
            },
            select: {
                firstName: true,
                lastName: true,
                number: true,
                spso: true,
                imageUrl: true,
                specialization: true,
            },
        })
        // receiverEmail = DOC_PROFILE_RECEIVER_EMAIL;
        receiverEmail = "sajeel@buildmeapp.io";
        Company = `"AVA ONE" <sajeel@buildmeapp.io>`;
        Subject = "New Doctor Registered - AVA ONE";
        Message = `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 10px; text-align: center;">
            <div style="background-color: #ffffff;">
                <p style="font-size: 20px; color: #2290F3;">New Healthcare Provider Registered</p>
                <div style="padding-right: 10px; padding-left: 10px; display: inline-block;">
                
                <p style="text-align: center; font-size: 28px; font-weight: bold; color: #2290F3;">
                    <a href="mailto:${email}" style="color: inherit; text-decoration: none;">${email}</a>
                </p>
                <table style="width: 100%; max-width: 500px; margin: 20px auto; border-collapse: collapse; text-align: left;">
                    <thead>
                    <tr>
                        <th style="padding: 10px; border-bottom: 2px solid #2290F3; font-size: 18px; color: #2290F3;">Label</th>
                        <th style="padding: 10px; border-bottom: 2px solid #2290F3; font-size: 18px; color: #2290F3;">Data</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Name</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${doctor?.firstName + " " + doctor?.lastName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Contact</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${doctor?.number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Specialization</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${doctor?.specialization}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Spso Number</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${doctor?.spso || "NA"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Image</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">
                            ${doctor?.imageUrl ? `<img src="${constructImageUrl(doctor.imageUrl, role)}" alt="Doctor Image" style="width: 100px; height: auto; border-radius: 5px;">` : 'NA'}
                        </td>
                    </tr>

                    </tbody>
                </table>
                </div>
            </div>
            </div>

          `
    }
    else if (role == "PATIENT") {
        const patient = await prisma.patientProfile.findUnique({
            where: {
                userId: id
            },
            select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
                dob: true,
                residence: true,
                gender: true,
                weight: true,
                height: true,
                bloodType: true,
                allergies: true,
                smokeOrVape: true,
                consumeAlcohol: true,
                sleepRating: true,
                fitnessRating: true,
                medicalCondition: true,
                medicationItems: true,

            },
        })
        const img = patient?.imageUrl
        // receiverEmail = PAT_PROFILE_RECEIVER_EMAIL;
        receiverEmail = "sajeel@buildmeapp.io";
        Company = `"AVA ONE" <sajeel@buildmeapp.io>`
        Subject = "New Patient Registered - AVA ONE";
        Message = `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 10px; text-align: center;">
            <div style="background-color: #ffffff;">
                <p style="font-size: 20px; color: #2290F3;">New Patient Registered</p>
                <div style="padding-right: 10px; padding-left: 10px; display: inline-block;">
                
                <p style="text-align: center; font-size: 28px; font-weight: bold; color: #2290F3;">
                    <a href="mailto:${email}" style="color: inherit; text-decoration: none;">${email}</a>
                </p>
                <table style="width: 100%; max-width: 500px; margin: 20px auto; border-collapse: collapse; text-align: left;">
                    <thead>
                    <tr>
                        <th style="padding: 10px; border-bottom: 2px solid #2290F3; font-size: 18px; color: #2290F3;">Label</th>
                        <th style="padding: 10px; border-bottom: 2px solid #2290F3; font-size: 18px; color: #2290F3;">Data</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Name</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.firstName + " " + patient?.lastName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Date of Birth</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${formatDate(patient?.dob)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Residence</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.residence}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Gender</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.gender}</td>
                    </tr>
                    <tr>
    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Image</td>
    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">
        <img src="${constructImageUrl(patient?.imageUrl, role)}" alt="Patient Image" style="max-width: 200px; height: auto;">
    </td>
</tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Weight</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.weight}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Height</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.height}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Blood Type</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.bloodType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Allergies</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.allergies}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Smoke Or Vape</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.smokeOrVape}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Consumes Alcohol</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.consumeAlcohol}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Sleep Rating</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.sleepRating}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Fitness Rating</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.fitnessRating}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Medical Condition</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.medicalCondition}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">Medication Items</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px;">${patient?.medicationItems}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
          `
    }


    try {
        const oauth2Client = new google.auth.OAuth2(
            OAUTH_CLIENT_ID,
            OAUTH_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: OAUTH_REFRESH_TOKEN,
        });

        const accessToken = OAUTH_ACCESS_TOKEN || "";

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: OAUTH_EMAIL,
                clientId: OAUTH_CLIENT_ID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN,
                accessToken: accessToken.toString(),
            },
        });

        await transporter.sendMail({
            from: Company,
            to: receiverEmail,
            subject: Subject,
            html: Message,
        });

    } catch (error) {
        console.error('Error sending feedback email:', error);
        throw new Error('Failed to send email');
    }
}
