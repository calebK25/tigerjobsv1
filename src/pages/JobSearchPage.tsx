
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobRecommendation } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Briefcase,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobSearchResults from '@/components/job-search/JobSearchResults';
import JobSearchFilters from '@/components/job-search/JobSearchFilters';

// Function to fetch job search results
const fetchJobSearchResults = async ({ 
  query, 
  location, 
  source 
}: { 
  query: string; 
  location?: string; 
  source?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('job-search', {
      body: { query, location, source }
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Error fetching job search results:', error);
    throw error;
  }
};

const JobSearchPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>(user?.major || '');
  const [location, setLocation] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { 
    data: searchResults, 
    isLoading, 
    error, 
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['jobSearch', searchQuery, location, selectedSource],
    queryFn: () => fetchJobSearchResults({ 
      query: searchQuery,
      location,
      source: selectedSource
    }),
    enabled: isSearching,
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter keywords to search for jobs",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Search</h1>
          <p className="text-muted-foreground">
            Find job listings across multiple platforms
          </p>
        </div>
      </div>

      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Search Parameters</CardTitle>
          <CardDescription>Enter keywords based on your major and skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs (e.g. Software Engineer, Marketing)"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location (optional)"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Job Sources</SelectLabel>
                  <SelectItem value="">All Sources</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} className="md:w-auto" disabled={isLoading || isRefetching}>
              {(isLoading || isRefetching) ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search Jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">Error fetching job listings</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      )}

      {isSearching && (
        <div className="grid grid-cols-1 gap-6">
          <JobSearchFilters />
          
          <JobSearchResults 
            results={searchResults?.results || []} 
            isLoading={isLoading || isRefetching}
            searchMetadata={{
              query: searchQuery,
              location: location || 'Any',
              sources: searchResults?.sources || [],
              count: searchResults?.count || 0
            }}
          />
        </div>
      )}
    </div>
  );
};

export default JobSearchPage;
