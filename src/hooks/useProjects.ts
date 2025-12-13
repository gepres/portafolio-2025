import { useState, useEffect, useCallback } from 'react';
import { getProjects, getAllProjects } from '../lib/firebase/firestore';
import type { Project, ProjectFilterCategory } from '../types';

export const useProjects = (isAdmin = false) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = isAdmin ? await getAllProjects() : await getProjects();
      console.log('data', data);
      
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filterByCategory = (category: ProjectFilterCategory) => {
    if (category === 'all') return projects;
    return projects.filter(p => p.category === category);
  };

  const getFeatured = () => projects.filter(p => p.featured);

  return {
    projects,
    loading,
    error,
    filterByCategory,
    getFeatured,
    refetch: fetchProjects,
  };
};
