const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Login response:', JSON.parse(data));
    const token = JSON.parse(data).accessToken;
    
    // Now test getting a video
    const videoOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/videos/1',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    
    const videoReq = http.request(videoOptions, (videoRes) => {
      let videoData = '';
      
      videoRes.on('data', (chunk) => {
        videoData += chunk;
      });
      
      videoRes.on('end', () => {
        console.log('\nVideo Data:');
        console.log(JSON.stringify(JSON.parse(videoData), null, 2));
      });
    });
    
    videoReq.on('error', (e) => {
      console.error('Video request error:', e.message);
    });
    
    videoReq.end();
  });
});

req.on('error', (e) => {
  console.error('Login error:', e.message);
});

req.write(JSON.stringify({
  email: 'test@example.com',
  password: 'password123'
}));

req.end();
