/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

// Static noise/grain effect for that "newspaper" feel
const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-multiply bg-[#fdfbf7]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
            <filter id="noiseFilter">
                <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.65" 
                    numOctaves="3" 
                    stitchTiles="stitch" />
            </filter>
            
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
    </div>
  );
};

export default InteractiveBackground;