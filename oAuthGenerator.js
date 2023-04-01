import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// For now mocking the access token for the api
export async function generateToken() {
    const { OAuth2Server } = require('oauth2-mock-server');
    let server = new OAuth2Server();
    //await server.start(3000, 'localhost');
    await server.issuer.keys.generate('RS256');
    await server.start(5000, 'localhost');
    // Build a new token
    token = await server.issuer.buildToken();
    await server.stop();
    return token;
}
