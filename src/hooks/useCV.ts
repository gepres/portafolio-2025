import { useState, useEffect } from 'react';
import { getAllCVData } from '../lib/firebase/cvService';
import type { CVData } from '../types';

export const useCV = () => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCVData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCVData();
      setCvData(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching CV data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVData();
  }, []);

  const refresh = () => {
    fetchCVData();
  };

  return {
    cvData,
    loading,
    error,
    refresh,
  };
};
