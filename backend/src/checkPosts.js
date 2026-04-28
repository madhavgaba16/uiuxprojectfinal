const http = require('http');
const url = 'http://localhost:5000/api/posts';

http.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      console.log('STATUS', res.statusCode);
      console.log('BODY:\n', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.error('RESPONSE PARSE ERROR', e);
      console.log('RAW BODY:\n', data);
    }
    process.exit(0);
  });
}).on('error', err => {
  console.error('REQUEST ERROR', err.message);
  process.exit(1);
});