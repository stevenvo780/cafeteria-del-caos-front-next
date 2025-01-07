'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PrivacyPoliciesModal from './PrivacyPoliciesModal';
import api from '@/utils/axios';
import { addNotification } from '@/redux/ui';
import { UserRole } from '../../../utils/types';

const PrivacyPoliciesPage: React.FC = () => {
  const [privacyPolicies, setPrivacyPolicies] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPrivacyPolicies = async () => {
      try {
        const response = await api.get('/config/privacy-policies');
        setPrivacyPolicies(response.data);
      } catch (error) {
        console.error('Error fetching privacy policies:', error);
        dispatch(addNotification({ message: 'Error al cargar las políticas de privacidad', color: 'danger' }));
      }
    };

    fetchPrivacyPolicies();
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
      <div dangerouslySetInnerHTML={{ __html: privacyPolicies || 'Cargando...' }} />

      {showEditModal && privacyPolicies && (
        <PrivacyPoliciesModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentPolicies={privacyPolicies}
          setPrivacyPolicies={setPrivacyPolicies}
        />
      )}
    </>
  );
};

export default PrivacyPoliciesPage;
