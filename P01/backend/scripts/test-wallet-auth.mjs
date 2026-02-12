import { ethers } from 'ethers';

const wallet = ethers.Wallet.createRandom();

async function test() {
  const address = wallet.address;
  const nonceRes = await fetch('http://localhost:3000/api/auth/wallet/nonce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  const nonceData = await nonceRes.json();
  if (nonceData.error) {
    console.error('Nonce error:', nonceData);
    return;
  }
  console.log('Nonce OK');

  const signature = await wallet.signMessage(nonceData.message);
  const loginRes = await fetch('http://localhost:3000/api/auth/wallet/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, signature }),
  });
  const data = await loginRes.json();
  if (data.error) {
    console.error('Login error:', data);
    return;
  }
  console.log('Login OK:', data.user.name, data.token);
}

test().catch(console.error);
