const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

function kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const regex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]lucide-react['"];?/g;
    
    let hasChanges = false;
    content = content.replace(regex, (match, importsStr) => {
        hasChanges = true;
        const imports = importsStr.split(',').map(i => i.trim()).filter(i => i);
        let result = [];
        let types = [];
        imports.forEach(i => {
            if (i.startsWith('type ') || i === 'LucideIcon') {
                types.push(i);
            } else {
                result.push(`import ${i} from 'lucide-react/dist/esm/icons/${kebabCase(i)}';`);
            }
        });
        if (types.length > 0) {
            result.push(`import { ${types.join(', ')} } from 'lucide-react';`);
        }
        return result.join('\n');
    });

    if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
