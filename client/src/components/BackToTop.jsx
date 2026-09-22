import { useState, useEffect } from 'react';
import { IconArrowUp } from './icons';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className="fixed bottom-5 left-5 z-[100] flex h-11 w-11 items-center justify-center rounded-md bg-forest text-card shadow-md hover:bg-forest2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
    >
      <IconArrowUp className="w-5 h-5" />
    </button>
  );
}