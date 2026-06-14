const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/shreenidhi/Dakshinamurthy_Website_V1/client/src/features/dimension-portal/info-cards';
const pages = [
  'PageOne.tsx', 'PageTwo.tsx', 'PageThree.tsx', 'PageFour.tsx', 'PageFive.tsx',
  'PageSix.tsx', 'PageSeven.tsx', 'PageEight.tsx', 'PageNine.tsx', 'PageTen.tsx'
];

const newNavBlock = `          {/* Portal Navigation */}
          {allDomains && allDomains.length > 0 && (() => {
            const currentIndex = allDomains.findIndex(d => d.id === domain.id);
            if (currentIndex === -1) return null;
            const prevDomain = allDomains[(currentIndex - 1 + allDomains.length) % allDomains.length];
            const nextDomain = allDomains[(currentIndex + 1) % allDomains.length];
            return (
              <div className="p-5 rounded-2xl glass-panel border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-gold-vintage tracking-widest pl-1">
                  Portal Navigation
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigateToDomain?.(prevDomain)}
                    className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-gold-vintage/[0.04] hover:border-gold-vintage/30 flex items-center justify-between text-left transition-all group cursor-pointer"
                  >
                    <div className="transform group-hover:-translate-x-1.5 transition-all text-slate-500 group-hover:text-gold-vintage">
                      ←
                    </div>
                    <div className="text-right">
                      <h5 className="font-display font-medium text-sm text-slate-200 group-hover:text-gold-vintage transition-colors">
                        Previous: {prevDomain.title}
                      </h5>
                    </div>
                  </button>
                  <button
                    onClick={() => onNavigateToDomain?.(nextDomain)}
                    className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-gold-vintage/[0.04] hover:border-gold-vintage/30 flex items-center justify-between text-left transition-all group cursor-pointer"
                  >
                    <div>
                      <h5 className="font-display font-medium text-sm text-slate-200 group-hover:text-gold-vintage transition-colors">
                        Next: {nextDomain.title}
                      </h5>
                    </div>
                    <div className="transform group-hover:translate-x-1.5 transition-all text-slate-500 group-hover:text-gold-vintage">
                      →
                    </div>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}`;

for (const page of pages) {
  const filepath = path.join(dir, page);
  if (!fs.existsSync(filepath)) continue;
  let content = fs.readFileSync(filepath, 'utf8');

  // We need to strip out the old broken nav block and replace it.
  // The nav block is at the bottom of the component.
  // Look for the end of Visual Sacred Gallery or Intertwined dimensions
  const galleryEndToken = '</div>\n          </div>\n\n';
  
  const visualGalleryIndex = content.indexOf('Visual geometry matrix');
  if (visualGalleryIndex !== -1) {
    const startOfNavBlock = content.indexOf('{/* Related/Intertwined domains */}');
    const startOfOldCode = content.indexOf('{relatedDomains.length > 0 && (');
    
    let cutPoint = -1;
    if (startOfNavBlock !== -1) {
      cutPoint = startOfNavBlock;
    } else if (startOfOldCode !== -1) {
      cutPoint = startOfOldCode;
    }

    if (cutPoint !== -1) {
      content = content.substring(0, cutPoint) + newNavBlock;
    }
  }

  // If there's any remaining `const relatedDomains = ...` definition, remove it.
  content = content.replace(/const relatedDomains = .*?;/, '');

  fs.writeFileSync(filepath, content);
}
console.log('Fixed relatedDomains syntax error properly.');
