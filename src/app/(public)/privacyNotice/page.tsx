'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PrivacyNoticeModal from './PrivacyPoliciesModal';
import api from '@/utils/axios';
import { addNotification } from '@/redux/ui';
import { UserRole } from '@/utils/types';

const PrivacyNoticePage: React.FC = () => {
  const [privacyNotice, setPrivacyNotice] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPrivacyNotice = async () => {
      try {
        const response = await api.get('/config/privacy-notice');
        setPrivacyNotice(response.data);
      } catch (error) {
        console.error('Error fetching privacy notice:', error);
        dispatch(addNotification({ message: 'Error al cargar el aviso de privacidad', color: 'danger' }));
      }
    };

    fetchPrivacyNotice();
  }, [dispatch]);

  return (
    <>
      {userRole === UserRole.SUPER_ADMIN && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px' }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer', zIndex: 100 }}
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: privacyNotice || 'Cargando...' }} />

      {showEditModal && privacyNotice && (
        <PrivacyNoticeModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentNotice={privacyNotice}
          setPrivacyNotice={setPrivacyNotice}
        />
      )}
    </>
  );
};

export default PrivacyNoticePage;
