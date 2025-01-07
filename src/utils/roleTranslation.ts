import { UserRole } from './types';

export const getRoleInSpanish = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Administrador';
    case UserRole.ADMIN:
      return 'Administrador';
    case UserRole.EDITOR:
      return 'Editor';
    case UserRole.USER:
      return 'Usuario';
    default:
      return 'Desconocido';
  }
};
