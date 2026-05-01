import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

// Nominatim policy: max 1 request/sec. We track the last request timestamp server-side.
// Note: In serverless, this state resets per cold start — good enough for low traffic.
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  // Rate limiting: enforce 1 req/sec toward Nominatim
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }
  lastRequestTime = Date.now();

  const url = new URL(NOMINATIM_BASE);
  url.searchParams.set('q', q.trim());
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        // Nominatim requires a valid User-Agent with contact info
        'User-Agent': `geopostermaker/1.0 (${process.env.NOMINATIM_CONTACT_EMAIL ?? 'contact@example.com'})`,
        'Accept-Language': 'fr,en',
      },
      next: { revalidate: 300 }, // Cache 5 min — same query rarely changes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Nominatim returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[geocode] Nominatim fetch failed:', err);
    return NextResponse.json({ error: 'Geocoding service unavailable' }, { status: 503 });
  }
}
