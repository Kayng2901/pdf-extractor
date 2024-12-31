import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Info, FileText, Edit2, Check, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const parsePageRange = (input, totalPages) => {
  const pages = new Set();
  const ranges = input.split(',').map(r => r.trim());
  
  for (const range of ranges) {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= totalPages) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = Number(range);
      if (!isNaN(page) && page > 0 && page <= totalPages) {
        pages.add(page);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
};

const PDFExtractor = () => {
  const [file, setFile] = useState(null);
  const [pageNum, setPageNum] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFileName, setOutputFileName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [expandedCard, setExpandedCard] = useState(false);

  useEffect(() => {
    if (file) {
      setOutputFileName(file.name.replace('.pdf', '_extracted.pdf'));
    }
  }, [file]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setFile(selectedFile);
    setError('');
    setProgress(0);
    setExpandedCard(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
    } catch (err) {
      setError('Error loading PDF: ' + err.message);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      const input = document.getElementById('file-upload');
      input.files = e.dataTransfer.files;
      await handleFileChange({ target: input });
    } else {
      setError('Please upload a PDF file');
    }
  };

  const extractPages = async (pages) => {
    if (!file || !pages.length) {
      setError('Please upload a PDF and specify page numbers');
      return;
    }

    if (pages.some(p => p < 1 || p > totalPages)) {
      setError(`Please enter valid page numbers between 1 and ${totalPages}`);
      return;
    }

    setProcessing(true);
    setError('');
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setProgress(20);
      
      const renderPromises = pages.map(async (pageNum) => {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        return {
          imgData: canvas.toDataURL('image/jpeg', 1.0),
          width: viewport.width,
          height: viewport.height
        };
      });

      setProgress(50);
      
      const renderedPages = await Promise.all(renderPromises);
      
      setProgress(80);

      const outputPdf = new window.jspdf.jsPDF();
      
      renderedPages.forEach((page, index) => {
        if (index > 0) {
          outputPdf.addPage([page.width, page.height]);
        }
        outputPdf.addImage(page.imgData, 'JPEG', 0, 0, page.width, page.height);
      });

      outputPdf.save(outputFileName);
      
      setProgress(100);
    } catch (err) {
      setError('Error extracting pages: ' + err.message);
    }

    setProcessing(false);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'first':
        setPageNum('1');
        extractPages([1]);
        break;
      case 'last':
        setPageNum(totalPages.toString());
        extractPages([totalPages]);
        break;
      default:
        break;
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl text-center text-slate-800 dark:text-slate-100 font-bold">
          PDF Page Extractor
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="inline-block w-5 h-5 ml-2 opacity-50 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Supported: PDF files up to 100MB</p>
                <p>Extract single or multiple pages</p>
                <p>Use format: 1,3,5-7</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-center text-slate-600 dark:text-slate-300 text-xl">
          Extract individual pages from your PDF documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative rounded-lg border-2 border-dashed p-8 transition-all duration-200
              ${dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-300 dark:border-slate-700'
              }
              ${file 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }
            `}
          >
            {dragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-lg backdrop-blur-sm">
                <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
                  Drop PDF here
                </p>
              </div>
            )}
            
            <Button 
              variant={file ? "outline" : "default"}
              className={`
                w-full transition-all duration-200 hover:scale-[1.02] text-2xl font-semibold py-10
                border-2 ${file ? 'border-green-400' : 'border-slate-200'} 
                dark:border-slate-600 rounded-lg shadow-sm
                hover:border-sky-400 dark:hover:border-sky-400
                ${!file ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' : ''}
                ${dragActive ? 'border-blue-500 scale-[1.02]' : ''}
              `}
              onClick={() => document.getElementById('file-upload').click()}
            >
              {file ? (
                <div className="flex flex-col items-center w-full gap-1">
                  <FileText className="w-5 h-5 mb-1" />
                  <div className="max-w-full px-4">
                    <p className="truncate text-base">
                      {file.name}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-3" />
                  Choose or drop PDF here
                </>
              )}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {totalPages > 0 && (
            <div className={`space-y-4 ${expandedCard ? 'animate-expandCard' : ''}`}>
              {isRenaming ? (
                <div className="space-y-2">
                  <label className="text-sm text-slate-600 dark:text-slate-400">
                    Name your extract
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={outputFileName}
                      onChange={(e) => setOutputFileName(e.target.value)}
                      className="flex-1"
                      placeholder="Enter file name"
                    />
                    <Button 
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsRenaming(false)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setOutputFileName(file.name.replace('.pdf', '_extracted.pdf'));
                        setIsRenaming(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <label className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    Name your extract:
                  </label>
                  <div className="flex items-center flex-1 min-w-0 ml-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 truncate block flex-1">
                      {outputFileName}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 flex-shrink-0"
                      onClick={() => setIsRenaming(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Input
                placeholder={`Enter page numbers (1-${totalPages}) e.g., 1,3,5-7`}
                value={pageNum}
                onChange={(e) => setPageNum(e.target.value)}
                className="transition-all duration-200 focus:scale-[1.02]"
              />

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleQuickAction('first')}
                  disabled={processing}
                >
                  First Page
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleQuickAction('last')}
                  disabled={processing}
                >
                  Last Page
                </Button>
              </div>
              
              <Button 
                className="w-full transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={() => extractPages(parsePageRange(pageNum, totalPages))}
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting...
                  </span>
                ) : 'Extract Pages'}
              </Button>

              {processing && (
                <Progress value={progress} className="w-full h-2" />
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFExtractor;