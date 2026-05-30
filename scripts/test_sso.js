(async ()=>{
  try {
    const loginRes = await fetch('https://ngdxh-backend.onrender.com/api/sim/sso/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'officer', role: 'police_officer', org: 'Demo Org' }),
    });
    const loginJson = await loginRes.json().catch(()=>null);
    console.log('LOGIN STATUS:', loginRes.status);
    console.log('LOGIN BODY:', loginJson);
    const token = loginJson?.token;
    if(!token){ console.error('No token from login'); process.exit(0); }
    const valRes = await fetch('https://ngdxh-backend.onrender.com/api/sim/sso/validate', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const valText = await valRes.text().catch(()=>'<no-body>');
    console.log('VALIDATE STATUS:', valRes.status);
    console.log('VALIDATE BODY:', valText);
  } catch(err){ console.error(err); process.exit(1); }
})();