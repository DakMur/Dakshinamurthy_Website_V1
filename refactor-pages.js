const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/shreenidhi/Dakshinamurthy_Website_V1/client/src/features/dimension-portal/info-cards';
const pages = [
  'PageOne.tsx', 'PageTwo.tsx', 'PageThree.tsx', 'PageFour.tsx', 'PageFive.tsx',
  'PageSix.tsx', 'PageSeven.tsx', 'PageEight.tsx', 'PageNine.tsx', 'PageTen.tsx'
];

for (const page of pages) {
  const filepath = path.join(dir, page);
  if (!fs.existsSync(filepath)) continue;
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace hardcoded "Esoteric Level IV Clearance" with dynamic `{domain.energyIndicator}`
  content = content.replace(/>\s*Esoteric Level IV Clearance\s*</, '>{domain.energyIndicator || "Tattva Level"}<');
  
  // Replace the 4-second brainwave text with nothing or remove it.
  const regexSchumann = /<p className="text-xs text-slate-400 font-mono max-w-md mb-8">[\s\S]*?Rescale your brainwaves to match the Earth's Schumann resonance using this 4-second pattern guide.[\s\S]*?<\/p>/;
  content = content.replace(regexSchumann, '');

  fs.writeFileSync(filepath, content);
}
console.log('Pages refactored successfully.');
