import fetch from 'node-fetch';

async function test() {
  console.log('GET Config');
  const resGet = await fetch('http://localhost:5000/api/v1/registration/config');
  const dataGet = await resGet.json();
  console.log(dataGet);

  console.log('POST Config');
  const resPost = await fetch('http://localhost:5000/api/v1/registration/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Registration Not Yet Opened',
      openDate: '2026-06-15T12:00:00.000Z'
    })
  });
  const dataPost = await resPost.json();
  console.log(dataPost);
}

test();
