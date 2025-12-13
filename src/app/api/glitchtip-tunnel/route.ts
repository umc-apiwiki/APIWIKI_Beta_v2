import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const serverUrl = process.env.GLITCHTIP_SERVER_URL?.replace(/\/$/, '');
  const projectId = process.env.GLITCHTIP_PROJECT_ID;
  const clientKey = process.env.GLITCHTIP_CLIENT_KEY;

  if (!serverUrl || !projectId || !clientKey) {
    return new Response('GlitchTip tunnel is not configured', { status: 500 });
  }

  const targetUrl = `${serverUrl}/api/${projectId}/envelope/?sentry_version=7&sentry_key=${clientKey}&sentry_client=sentry.javascript.nextjs`;

  try {
    const envelope = await req.text();
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
        Accept: '*/*',
      },
      body: envelope,
    });

    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText });
  } catch (error) {
    console.error('GlitchTip tunnel error', error);
    return new Response('GlitchTip tunnel error', { status: 500 });
  }
}
