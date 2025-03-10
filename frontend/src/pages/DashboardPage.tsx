import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AnalysisResult {
  fit_score: number;
  insights: string[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
        setError(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
        setError(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      setError("Please upload your resume");
      return;
    }

    if (!jobTitle && !jobDescription && !jobUrl) {
      setError(
        "Please provide at least one of: job title, job description, or job URL"
      );
      return;
    }

    if (jobTitle && !jobDescription) {
      setError("Please provide job description");
      return;
    }

    if (!jobTitle && jobDescription) {
      setError("Please provide job title");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      if (jobTitle) formData.append("job_title", jobTitle);
      if (jobDescription) formData.append("job_description", jobDescription);
      if (jobUrl) formData.append("job_url", jobUrl);

      // Get the access token from local storage
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(
        "http://localhost:8000/api/v1/jobs/submit-application",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Add reset function to clear all states
  const handleReset = () => {
    setResume(null);
    setJobTitle("");
    setJobDescription("");
    setJobUrl("");
    setError(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl mt-8">
          <div className="bg-white rounded-xl p-8 shadow-md border border-border">
            <h1 className="text-2xl font-bold mb-6">
              Resume Analyzer Dashboard
            </h1>

            <div className="bg-secondary/50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium mb-2">
                Welcome, {user?.name}
              </h2>
              <p className="text-muted-foreground">
                Upload your resume and enter job details to get personalized
                insights on how to improve your application.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Input Section */}
              <div className="w-full lg:w-1/2">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Upload Resume</h3>
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        } ${resume ? "bg-green-50" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("resume-upload")?.click()
                        }
                      >
                        <input
                          type="file"
                          id="resume-upload"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />

                        {resume ? (
                          <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-green-500 mb-2" />
                            <p className="font-medium">{resume.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResume(null);
                              }}
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="font-medium">
                              Drag and drop your resume here
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              or click to browse files
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF files only
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Job Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="job-title"
                            className="block text-sm font-medium mb-1"
                          >
                            Job Title
                          </label>
                          <Input
                            id="job-title"
                            placeholder="e.g. Frontend Developer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="job-description"
                            className="block text-sm font-medium mb-1"
                          >
                            Job Description
                          </label>
                          <Textarea
                            id="job-description"
                            placeholder="Paste the job description here..."
                            rows={5}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="job-url"
                            className="block text-sm font-medium mb-1"
                          >
                            Job Posting URL (optional)
                          </label>
                          <Input
                            id="job-url"
                            placeholder="https://example.com/job-posting"
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="px-8"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Resume...
                        </>
                      ) : (
                        "Analyze Resume"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="px-8"
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                {isLoading && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">
                      Analyzing your resume...
                    </h3>
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {progress < 30 &&
                        "Extracting information from your resume..."}
                      {progress >= 30 &&
                        progress < 60 &&
                        "Comparing with job requirements..."}
                      {progress >= 60 &&
                        progress < 90 &&
                        "Generating personalized insights..."}
                      {progress >= 90 && "Almost done..."}
                    </p>
                  </div>
                )}
              </div>

              {/* Analysis Results Section */}
              <div className="w-full lg:w-1/2">
                {result ? (
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      Analysis Results
                    </h3>

                    <Card className="mb-6">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium">Resume Fit Score</h4>
                          <div className="text-2xl font-bold">
                            {result.fit_score}%
                          </div>
                        </div>

                        <div className="w-full bg-secondary h-4 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              result.fit_score >= 80
                                ? "bg-green-500"
                                : result.fit_score >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${result.fit_score}%` }}
                          ></div>
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                          {result.fit_score >= 80
                            ? "Great match! Your resume aligns well with this job."
                            : result.fit_score >= 60
                            ? "Good match with room for improvement."
                            : "Consider updating your resume to better match this job."}
                        </p>
                      </CardContent>
                    </Card>

                    <div>
                      <h4 className="text-lg font-medium mb-4">
                        Improvement Insights
                      </h4>
                      <ul className="space-y-4">
                        {result.insights.map((insight, index) => (
                          <li
                            key={index}
                            className="bg-secondary/30 p-4 rounded-lg"
                          >
                            <p>{insight}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8 bg-secondary/20 rounded-lg">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                      <p className="text-muted-foreground">
                        Upload your resume and job details to see analysis results here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
