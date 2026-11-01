import fs from 'fs';
const c=fs.readFileSync('src/components/PatientProfileOverview/index.jsx','utf8');
const lines=c.split('\n');
console.log(typeof lines[236]);
console.log(lines[236]);
