
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for manual override (for testing)
    const url = new URL(request.url);
    const override = url.searchParams.get('override');
    
    if (override === 'NG') {
      console.log('🔧 Manual override to Nigeria');
      return NextResponse.json({
        countryCode: 'NG',
        countryName: 'Nigeria',
        ip: 'manual-override',
        debug: { manualOverride: true }
      });
    }
    
    // Get the client's IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    let ip = forwarded ? forwarded.split(',')[0] : realIp || cfConnectingIp || '127.0.0.1';
    
    // Handle localhost/development environment
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1' || ip.startsWith('::ffff:127.0.0.1')) {
      console.log('🔧 Development environment detected, using external IP detection');
      // For development, try to get real IP from external service
      try {
        const externalResponse = await fetch('https://api.ipify.org?format=json');
        const externalData = await externalResponse.json();
        ip = externalData.ip;
        console.log('🌐 External IP detected:', ip);
      } catch {
        console.log('❌ Could not get external IP, using fallback');
        ip = '8.8.8.8'; // Google DNS as fallback
      }
    }
    
    console.log('🔍 Final IP to use:', ip);
    
    // Try multiple geolocation services
    let data = null;
    const services = [
      { name: 'ipapi.co', url: `https://ipapi.co/${ip}/json/` },
      { name: 'ipinfo.io', url: `https://ipinfo.io/${ip}/json` },
      { name: 'ip-api.com', url: `http://ip-api.com/json/${ip}` }
    ];
    
    for (const service of services) {
      try {
        console.log(`🔍 Trying ${service.name}...`);
        const response = await fetch(service.url);
        if (response.ok) {
          data = await response.json();
          console.log(`✅ ${service.name} success:`, data);
          break;
        } else {
          console.log(`❌ ${service.name} failed:`, response.status);
        }
      } catch (error) {
        console.log(`❌ ${service.name} error:`, error);
      }
    }
    
    console.log('🌍 Raw IP API response:', data);
    
    // Handle different service response formats
    let countryCode = 'EE';
    let countryName = 'Estonia';
    
    if (data) {
      // ipapi.co format
      if (data.country_code) {
        countryCode = data.country_code;
        countryName = data.country_name || 'Estonia';
      }
      // ipinfo.io format
      else if (data.country) {
        countryCode = data.country;
        countryName = data.region || 'Estonia';
      }
      // ip-api.com format
      else if (data.countryCode) {
        countryCode = data.countryCode;
        countryName = data.country || 'Estonia';
      }
    }
    
    console.log('📍 Original country code:', countryCode, 'Original country name:', countryName);
    
    // Handle specific countries as requested
    if (countryCode === 'NG') {
      countryName = 'Nigeria';
    } else if (countryCode === 'EE') {
      countryName = 'Estonia';
    } else {
      // Default to Estonia for any other country
      countryCode = 'EE';
      countryName = 'Estonia';
    }
    
    console.log('✅ Final result:', { countryCode, countryName, ip });
    
    return NextResponse.json({
      countryCode,
      countryName,
      ip: ip,
      debug: {
        originalCountryCode: data.country_code,
        originalCountryName: data.country_name,
        detectedIp: ip
      }
    });
  } catch (error) {
    console.error('Error detecting location:', error);
    // Return default Estonia location on error
    return NextResponse.json({
      countryCode: 'EE',
      countryName: 'Estonia',
      ip: 'unknown',
    });
  }
} 