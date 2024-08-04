import bcrypt from 'bcryptjs';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './mongodb';
import UserAccount from '@/utils/dbModels/UserAccount';
import UserLoginData from '@/utils/dbModels/UserLoginData';
import UserLoginDataExternal from '@/utils/dbModels/UserLoginDataExternal';

export const authOptions = {
    pages: {
        signIn: '/signin',
        newUser: '/create',
    },
    providers: [
        CredentialProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: "Email"},
                password: { label: 'Password', type: 'password' },
            },
        
            async authorize(credentials) {
                await dbConnect();

                if (!credentials.email || !credentials.password) {
                    throw new Error('Please enter your email and password');
                }
                
                const userLoginData = await UserLoginData.findOne({ EmailAddress: credentials.email });
                if (!userLoginData) {
                    throw new Error('Email or Password is incorrect');
                }

                const isValid = await bcrypt.compare(credentials.password, userLoginData.PasswordHash);

                if (!isValid) {
                    throw new Error('Email or Password is incorrect');
                }

                const userAccount = await UserAccount.findOne({ _id: userLoginData.UserId });

                return {
                    id: userAccount._id,
                    userId: userAccount._id,
                    email: userLoginData.EmailAddress,
                    name: `${userAccount.FirstName} ${userAccount.LastName}`,
                };
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            async profile(profile) {
                await dbConnect();
                
                const email = profile.email;
                const name = profile.name.split(' ');
                const firstName = name[0];
                const lastName = name[name.length - 1];

                let userLoginDataExternal = await UserLoginDataExternal.findOne({ EmailAddress: email });
                let userAccount = ''

                if (!userLoginDataExternal) {
                    userAccount = new UserAccount({
                        FirstName: firstName,
                        LastName: lastName,
                    });

                    await userAccount.save();

                    userLoginDataExternal = new UserLoginDataExternal({
                        UserId: userAccount._id,
                        EmailAddress: email,
                        ExternalProviderId: 1, // Assuming 1 is for Google, adjust as needed
                        ExternalProviderToken: profile.sub // Using Google's sub as the token
                    });
                    await userLoginDataExternal.save();
                }


                return {
                    id: userLoginDataExternal.ExternalProviderToken,
                    userId: userAccount._id,
                    name: `${userAccount.FirstName} ${userAccount.LastName}`,
                    email: email,
                };
            }
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            console.log(token);
            if (token) {
                session.user.id = token.id;
                session.user.userId = token.userId;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },
        async jwt({ token, user }) {
            await dbConnect();
            const userLoginData = await UserLoginData.findOne({ EmailAddress: token.email });
            
            if (!userLoginData) {
                // Check if it's an external login
                const userLoginDataExternal = await UserLoginDataExternal.findOne({ EmailAddress : token.email });
                if (!userLoginDataExternal) {
                    if (user) {
                        token.id = user?.id;
                    }
                    return token;
                }
                const userAccount = await UserAccount.findById(userLoginDataExternal.UserId);
                return {
                    id: userAccount._id,
                    // userId: userAccount._id,
                    email: token.email,
                    name: `${userAccount.FirstName} ${userAccount.LastName}`,
                };
            }

            const userAccount = await UserAccount.findById(userLoginData.UserId);
            return {
                id: userAccount._id,
                // userId: userAccount._id,
                email: userLoginData.EmailAddress,
                name: `${userAccount.FirstName} ${userAccount.LastName}`,
            };
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.SECRET,
}