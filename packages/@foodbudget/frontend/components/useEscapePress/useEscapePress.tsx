import { useEffect } from 'react';

const useEscapePress = (onEscapePress: () => void): null => {
  useEffect(() => {
    const escapePress = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onEscapePress();
      }
    };

    window.addEventListener('keyup', escapePress);

    return (): void => window.removeEventListener('keyup', escapePress);
  }, [onEscapePress]);

  return null;
};

export default useEscapePress;
