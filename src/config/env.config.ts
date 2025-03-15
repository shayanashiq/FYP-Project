import { z } from 'zod';


const envSchema = z.object({
    OAUTH_EMAIL: z.string().email(),
    OAUTH_CLIENT_ID: z.string(),
    OAUTH_CLIENT_SECRET: z.string(),
    OAUTH_REFRESH_TOKEN: z.string(),
    OAUTH_ACCESS_TOKEN: z.string(),
    MEET_LINK_BASE_URL: z.string(),
    MEET_LINK_CREATION_PASSWORD: z.string(),
}).passthrough()

const envResult = envSchema.safeParse(process.env)

if (!envResult.success) {
    throw envResult.error;
}

const envConfig = Object.freeze({
    oauth: {
        url: 'https://developers.google.com/oauthplayground',
        email: envResult.data.OAUTH_EMAIL,
        clientId: envResult.data.OAUTH_CLIENT_ID,
        clientSecret: envResult.data.OAUTH_CLIENT_SECRET,
        refreshToken: envResult.data.OAUTH_REFRESH_TOKEN,
        accessToken: envResult.data.OAUTH_ACCESS_TOKEN,
    },
    meetLink: {
        baseURL: envResult.data.MEET_LINK_BASE_URL,
        creationPassword: envResult.data.MEET_LINK_CREATION_PASSWORD
    }
});

export default envConfig;