const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/subjects',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  
  console.log('Response Status:', res.statusCode);
  console.log('Response Headers:', res.headers);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const subjects = JSON.parse(data);
      console.log('\n✅ Subjects loaded successfully!');
      console.log('Total subjects:', subjects.length);
      console.log('\nFirst 3 subjects:');
      subjects.slice(0, 3).forEach((s, i) => {
        console.log(`${i + 1}. ${s.title} - $${s.price_usd} (Free: ${s.is_free})`);
      });
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
