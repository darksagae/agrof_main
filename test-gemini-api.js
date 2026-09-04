// Test if Gemini API is accessible
const GEMINI_API_KEY = "AIzaSyDUMB5H8bzSIbaECO2CmVk3hfoNj7zfU60";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API connection...');
  console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('');

  try {
    const payload = {
      contents: [{
        parts: [
          { text: "Say 'Hello, AGROF!' if you can read this." }
        ]
      }]
    };

    console.log('📡 Sending test request to Gemini API...');
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📊 Response status:', response.status);
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.log('═══════════════════════════════════════');
      console.log('❌ GEMINI API ERROR');
      console.log('═══════════════════════════════════════');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
      console.log('');
      console.log('Common Issues:');
      console.log('- Invalid API key');
      console.log('- API not enabled in Google Cloud');
      console.log('- Billing not set up');
      console.log('- Network/firewall blocking request');
      console.log('');
      process.exit(1);
    }

    const result = await response.json();
    
    console.log('═══════════════════════════════════════');
    console.log('✅ GEMINI API IS WORKING!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Response:', result.candidates[0].content.parts[0].text);
    console.log('');
    console.log('🎉 Gemini AI is ready for disease detection!');
    console.log('');
    console.log('Your AGROF app will use:');
    console.log('- Gemini AI (Online mode)');
    console.log('- High accuracy disease detection');
    console.log('- Detailed treatment recommendations');
    console.log('');
    process.exit(0);

  } catch (error) {
    console.log('═══════════════════════════════════════');
    console.log('❌ CONNECTION ERROR');
    console.log('═══════════════════════════════════════');
    console.log('Error:', error.message);
    console.log('');
    console.log('Possible causes:');
    console.log('- No internet connection');
    console.log('- Firewall blocking Google APIs');
    console.log('- Network timeout');
    console.log('');
    console.log('Your app will fall back to:');
    console.log('- TensorFlow Lite (Offline mode)');
    console.log('- Basic disease detection');
    console.log('- Limited recommendations');
    console.log('');
    process.exit(1);
  }
}

testGeminiAPI();


const GEMINI_API_KEY = "AIzaSyDUMB5H8bzSIbaECO2CmVk3hfoNj7zfU60";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API connection...');
  console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('');

  try {
    const payload = {
      contents: [{
        parts: [
          { text: "Say 'Hello, AGROF!' if you can read this." }
        ]
      }]
    };

    console.log('📡 Sending test request to Gemini API...');
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📊 Response status:', response.status);
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.log('═══════════════════════════════════════');
      console.log('❌ GEMINI API ERROR');
      console.log('═══════════════════════════════════════');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
      console.log('');
      console.log('Common Issues:');
      console.log('- Invalid API key');
      console.log('- API not enabled in Google Cloud');
      console.log('- Billing not set up');
      console.log('- Network/firewall blocking request');
      console.log('');
      process.exit(1);
    }

    const result = await response.json();
    
    console.log('═══════════════════════════════════════');
    console.log('✅ GEMINI API IS WORKING!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Response:', result.candidates[0].content.parts[0].text);
    console.log('');
    console.log('🎉 Gemini AI is ready for disease detection!');
    console.log('');
    console.log('Your AGROF app will use:');
    console.log('- Gemini AI (Online mode)');
    console.log('- High accuracy disease detection');
    console.log('- Detailed treatment recommendations');
    console.log('');
    process.exit(0);

  } catch (error) {
    console.log('═══════════════════════════════════════');
    console.log('❌ CONNECTION ERROR');
    console.log('═══════════════════════════════════════');
    console.log('Error:', error.message);
    console.log('');
    console.log('Possible causes:');
    console.log('- No internet connection');
    console.log('- Firewall blocking Google APIs');
    console.log('- Network timeout');
    console.log('');
    console.log('Your app will fall back to:');
    console.log('- TensorFlow Lite (Offline mode)');
    console.log('- Basic disease detection');
    console.log('- Limited recommendations');
    console.log('');
    process.exit(1);
  }
}

testGeminiAPI();



