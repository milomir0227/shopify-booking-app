import { Toast, ToastProps } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { ToastContext } from './Toast.context';

export const ToastProvider = ({ children }: any) => {
  const [toast, setToast] = useState<Partial<ToastProps>>();
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const show = useCallback((value: Partial<ToastProps>) => {
    setToast(value);
    setActive(true);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {active && (
        <Toast
          duration={3500}
          content="test"
          onDismiss={toggleActive}
          {...toast}
        />
      )}
      {children}
    </ToastContext.Provider>
  );
};