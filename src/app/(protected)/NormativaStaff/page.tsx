'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import StaffNormativeModal from './NormativaStaffModal';
import api from '@/utils/axios';
import { addNotification } from '@/redux/ui';
import { FaEdit } from 'react-icons/fa';
import { UserRole } from '../../../utils/types';

const StaffNormativePage: React.FC = () => {
  const [staffNormative, setStaffNormative] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStaffNormative = async () => {
      try {
        const response = await api.get('/config/staff-normative');
        setStaffNormative(response.data);
      } catch (error) {
        console.error('Error fetching staff normative:', error);
        dispatch(addNotification({ message: 'Error al cargar la normativa del staff', color: 'danger' }));
      }
    };
    fetchStaffNormative();
  }, [dispatch]);

  return (
    <>
      {(userRole === UserRole.SUPER_ADMIN) && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px' }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer', zIndex:100 }}
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: staffNormative || 'Cargando...' }} />
      {showEditModal && staffNormative && (
        <StaffNormativeModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentNormative={staffNormative}
          setStaffNormative={setStaffNormative}
        />
      )}
    </>
  );
};

export default StaffNormativePage;
