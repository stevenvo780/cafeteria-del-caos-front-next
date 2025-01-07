'use client';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../redux/ui';
import { RootState } from '../redux/store';

interface AlertComponentProps {
  id: string;
  color: string;
  message: string;
  onRemoveNotification: (id: string) => void;
}

const InfoAlert: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const dispatch = useDispatch();

  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="alert-container">
      {notifications.map((notification, i) => (
        <AlertComponent
          key={i}
          id={notification.id || ''}
          color={notification.color || 'success'}
          message={notification.message}
          onRemoveNotification={handleRemoveNotification}
        />
      ))}
    </div>
  );
};

const AlertComponent: React.FC<AlertComponentProps> = ({ id, color, message, onRemoveNotification }) => {
  const [show, setShow] = React.useState(true);

  const onDismiss = () => {
    setShow(false);
    onRemoveNotification(id);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemoveNotification(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemoveNotification]);

  if (!show) {
    return null;
  }

  return (
    <Alert
      variant={color}
      dismissible
      onClose={onDismiss}
      style={{
        marginBottom: '10px',
        paddingRight: '40px',
        pointerEvents: 'auto',
        wordWrap: 'break-word',
        overflowY: 'auto',
      }}
    >
      <p>{message}</p>
    </Alert>
  );
};

export default InfoAlert;
