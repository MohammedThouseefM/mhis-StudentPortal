'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import authService from '@/services/auth-service';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<Array<{name: string; status: 'success' | 'error'; message: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const runTests = async () => {
      setIsLoading(true);
      const results = [];
      
      // Test 1: Check if API base URL is accessible
      try {
        const response = await fetch('/api');
        if (response.ok) {
          results.push({
            name: 'API Base URL',
            status: 'success',
            message: 'API base URL is accessible'
          });
        } else {
          results.push({
            name: 'API Base URL',
            status: 'error',
            message: `API base URL returned status ${response.status}`
          });
        }
      } catch (error) {
        results.push({
          name: 'API Base URL',
          status: 'error',
          message: `Failed to access API base URL: ${error instanceof Error ? error.message : String(error)}`
        });
      }
      
      // Test 2: Check announcements API
      try {
        const response = await api.announcements.getAll();
        results.push({
          name: 'Announcements API',
          status: response.success ? 'success' : 'error',
          message: response.success 
            ? `Successfully fetched ${response.data?.length || 0} announcements` 
            : `Failed to fetch announcements: ${response.error || response.message || 'Unknown error'}`
        });
      } catch (error) {
        results.push({
          name: 'Announcements API',
          status: 'error',
          message: `Error fetching announcements: ${error instanceof Error ? error.message : String(error)}`
        });
      }
      
      // Test 3: Check students API
      try {
        const response = await api.students.getAll();
        results.push({
          name: 'Students API',
          status: response.success ? 'success' : 'error',
          message: response.success 
            ? `Successfully fetched ${response.data?.length || 0} students` 
            : `Failed to fetch students: ${response.error || response.message || 'Unknown error'}`
        });
      } catch (error) {
        results.push({
          name: 'Students API',
          status: 'error',
          message: `Error fetching students: ${error instanceof Error ? error.message : String(error)}`
        });
      }
      
      // Test 4: Check teachers API
      try {
        const response = await api.teachers.getAll();
        results.push({
          name: 'Teachers API',
          status: response.success ? 'success' : 'error',
          message: response.success 
            ? `Successfully fetched ${response.data?.length || 0} teachers` 
            : `Failed to fetch teachers: ${response.error || response.message || 'Unknown error'}`
        });
      } catch (error) {
        results.push({
          name: 'Teachers API',
          status: 'error',
          message: `Error fetching teachers: ${error instanceof Error ? error.message : String(error)}`
        });
      }
      
      setTestResults(results);
      setIsLoading(false);
    };
    
    runTests();
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${result.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}
            >
              <h2 className="font-semibold text-lg">{result.name}</h2>
              <p className={result.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </p>
            </div>
          ))}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Connection Summary</h2>
            <p>
              {testResults.every(r => r.status === 'success') 
                ? '✅ All API connections are working correctly!' 
                : `❌ ${testResults.filter(r => r.status === 'error').length} of ${testResults.length} API connections failed.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}