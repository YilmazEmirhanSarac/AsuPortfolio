import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { siteMetadata } from '../../data/data';

// Support SSR natively in Astro allowing endpoints
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name')?.toString();
    const email = data.get('email')?.toString();
    const message = data.get('message')?.toString();
    const serviceType = data.get('service_type')?.toString();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Read the secret from `.env` (which is tracked securely in deployment)
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    // DEV MODE: If the user hasn't added their API key yet (e.g. before Step 8), gracefully simulate success 
    if (!resendApiKey) {
      console.log(`\n--- [PORTFOLIO INQUIRY RECEIVED (MOCK)] ---`);
      console.log(`Name:    ${name}`);
      console.log(`Email:   ${email}`);
      console.log(`Service: ${serviceType}`);
      console.log(`Message: ${message}`);
      console.log(`-------------------------------------------\n`);
      return new Response(JSON.stringify({ success: true, simulated: true }), { status: 200 });
    }

    // PRODUCTION MODE: Actual Resend execution
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: `Portfolio <onboarding@resend.dev>`, // Must be an authorized domain in actual Resend portal
      to: [siteMetadata.email], 
      subject: `New Portfolio Inquiry: ${serviceType}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Inquiry from ${name}</h2>
          <p><strong>Contact Email:</strong> ${email}</p>
          <p><strong>Service Requested:</strong> ${serviceType}</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error processing form:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
