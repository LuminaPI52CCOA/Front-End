import { useCallback } from 'react';
import { getDoctorById } from '../services/doctorService';
import { useRemoteData } from './useRemoteData';

export function useDoctor(id) {
  const loader = useCallback(async () => {
    if (!id) return null;
    return getDoctorById(id);
  }, [id]);

  const { data, ...resto } = useRemoteData(loader);
  return { dentist: data, ...resto };
}
