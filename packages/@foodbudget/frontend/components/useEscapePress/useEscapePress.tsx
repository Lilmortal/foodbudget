import { useEffect } from 'react';

const useEscapePress = (onEnterPress: () => void): void => {
  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onEnterPress();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePress);

    return () => {
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, []);
};

export default useEscapePress;
