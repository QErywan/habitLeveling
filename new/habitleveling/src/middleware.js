import { withAuth } from 'next-auth/middleware';

export default withAuth({
    secret: process.env.SECRET,
});

// set dashboard as a protected route that will redicrect to login if not authenticated
export const config = { matcher: ['/dashboard', '/create'] };
