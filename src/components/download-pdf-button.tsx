
'use client';

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateStudentPdfReport } from '@/lib/generate-pdf-report';

type DownloadPdfButtonProps = {
  elementId: string;
  studentName: string;
  className?: string;
};

export function DownloadPdfButton({ elementId, studentName, className }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsGenerating(true);
    toast({
      title: 'Generating PDF Report...',
      description: 'Please wait, this may take a moment.',
    });

    try {
      const pdfBlob = await generateStudentPdfReport(elementId);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Progress-Report-${studentName.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
          title: 'Report Downloaded',
          description: 'Your PDF report has been generated successfully.'
      });

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'An error occurred while creating the report.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isGenerating} className={className}>
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </Button>
  );
}
