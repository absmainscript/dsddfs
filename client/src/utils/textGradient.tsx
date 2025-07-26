import React from 'react';

// Gradientes disponíveis para badges (texto entre parênteses)
const BADGE_GRADIENTS = {
  'pink-purple': 'from-pink-500 to-purple-600',
  'blue-purple': 'from-blue-500 to-purple-600',
  'green-blue': 'from-green-500 to-blue-600',
  'orange-red': 'from-orange-500 to-red-600',
  'teal-cyan': 'from-teal-500 to-cyan-600',
  'indigo-purple': 'from-indigo-500 to-purple-600',
  'rose-pink': 'from-rose-500 to-pink-600',
  'emerald-teal': 'from-emerald-500 to-teal-600',
  'violet-purple': 'from-violet-500 to-purple-600',
  'amber-orange': 'from-amber-500 to-orange-600',
  'sky-blue': 'from-sky-500 to-blue-600',
  'lime-green': 'from-lime-500 to-green-600',
  'fuchsia-pink': 'from-fuchsia-500 to-pink-600',
  'cyan-blue': 'from-cyan-500 to-blue-600',
  'yellow-orange': 'from-yellow-500 to-orange-600'
};

export function processTextWithGradient(text: string, badgeGradient?: string): React.ReactNode {
  if (!text) return text;

  // Processa texto com parênteses para gradiente
  const parts = text.split(/(\([^)]+\))/);

  // Usa o gradiente personalizado ou o padrão
  const gradientClass = badgeGradient ? BADGE_GRADIENTS[badgeGradient as keyof typeof BADGE_GRADIENTS] || BADGE_GRADIENTS['pink-purple'] : BADGE_GRADIENTS['pink-purple'];

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('(') && part.endsWith(')')) {
          const innerText = part.slice(1, -1);
          return (
            <span 
              key={index} 
              className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent font-semibold`}
            >
              {innerText}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

export { BADGE_GRADIENTS };