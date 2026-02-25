/**
 * Cloudflare Worker: CORS Proxy and Google Token Verifier
 * 
 * This worker:
 * 1. Forwards requests from GitHub Pages to Google Apps Script
 * 2. Verifies Google Sign-In tokens (no OAuth scope restrictions)
 * 3. Adds proper CORS headers
 */

// Replace with your actual Google Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbytHP9S-SwNJRLLBzqDXkq2i8Ng0nGFZP4P2AnR4DHkc6IQqe7mW2DgHz-i4LovBhYh/exec';

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    // Always respond to OPTIONS with CORS headers
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // Handle POST requests
    if (request.method === 'POST') {
      try {
        const requestBody = await request.text();
        const requestData = JSON.parse(requestBody);

        // If this is a token verification request, handle it here
        if (requestData.idToken && !requestData.action) {
          return await verifyGoogleToken(requestData.idToken);
        }

        // Otherwise, forward to Google Apps Script
        const response = await fetch(GAS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody
        });
        const responseBody = await response.text();
        const newHeaders = new Headers(response.headers);
        Object.entries(CORS_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
        newHeaders.set('Content-Type', 'application/json');
        return new Response(responseBody, {
          status: response.status,
          headers: newHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          ok: false, 
          error: error.message 
        }), {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          }
        });
      }
    }

    // Method not allowed
    return new Response('Method not allowed', {
      status: 405,
      headers: CORS_HEADERS
    });
  }
};

async function verifyGoogleToken(idToken) {
  try {
    const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token verification failed',
        debug: 'Google API returned: ' + JSON.stringify(data)
      }), {
        status: 401,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        }
      });
    }

    if (!data.email_verified) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email not verified',
        email: data.email
      }), {
        status: 401,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      email: data.email,
      token_verified: true
    }), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Token verification error: ' + error.message
    }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      }
    });
  }
}
