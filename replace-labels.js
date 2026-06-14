const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace "Wisdom Lectures" -> "Prathama Prakasa"
      if (content.includes('Wisdom Lectures')) {
        content = content.replace(/Wisdom Lectures/g, 'Prathama Prakasa');
        changed = true;
      }
      
      // Replace "Dimension Portals" -> "Tattva Darśana"
      if (content.includes('Dimension Portals')) {
        content = content.replace(/Dimension Portals/g, 'Tattva Darśana');
        changed = true;
      }

      // Replace "Dimension Portal" -> "Tattva Darśana"
      if (content.includes('Dimension Portal')) {
        content = content.replace(/Dimension Portal/g, 'Tattva Darśana');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir('c:/Users/shreenidhi/Dakshinamurthy_Website_V1/client/src');
console.log('Global labels replaced.');
