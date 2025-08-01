import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all possible IP headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const xRealIp = request.headers.get('x-real-ip');
    
    const detectedIp = forwarded ? forwarded.split(',')[0] : realIp || cfConnectingIp || xRealIp || '127.0.0.1';
    
    console.log('🔍 Debug - All IP headers:', {
      'x-forwarded-for': forwarded,
      'x-real-ip': realIp,
      'cf-connecting-ip': cfConnectingIp,
      'detected-ip': detectedIp
    });
    
    // Try multiple IP geolocation services
    const services = [
      { name: 'ipapi.co', url: `https://ipapi.co/${detectedIp}/json/` },
      { name: 'ipinfo.io', url: `https://ipinfo.io/${detectedIp}/json` },
      { name: 'ip-api.com', url: `http://ip-api.com/json/${detectedIp}` }
    ];
    
    const results: Record<string, unknown> = {};
    
    for (const service of services) {
      try {
        const response = await fetch(service.url);
        const data = await response.json();
        results[service.name] = data;
        console.log(`🌍 ${service.name} result:`, data);
      } catch (error) {
        console.error(`❌ Error with ${service.name}:`, error);
        results[service.name] = { error: (error as Error).message };
      }
    }
    
    return NextResponse.json({
      detectedIp,
      headers: {
        'x-forwarded-for': forwarded,
        'x-real-ip': realIp,
        'cf-connecting-ip': cfConnectingIp,
      },
      services: results
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json({ error: (error as Error).message });
  }
} 