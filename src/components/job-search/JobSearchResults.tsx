
import React, { useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Briefcase,
  Search,
  Building
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { JobRecommendation } from '@/types';
import gsap from 'gsap';

interface SearchMetadata {
  query: string;
  location: string;
  sources: string[];
  count: number;
}

interface JobSearchResultsProps {
  results: JobRecommendation[];
  isLoading: boolean;
  searchMetadata: SearchMetadata;
}

const JobSearchResults = ({ results, isLoading, searchMetadata }: JobSearchResultsProps) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && resultsRef.current) {
      gsap.fromTo(
        resultsRef.current.children,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.3, 
          ease: "power2.out",
          clearProps: "all" 
        }
      );
    }
  }, [isLoading, results]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-2" />
              <div className="flex space-x-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold">
            Search Results <Badge variant="outline">{searchMetadata.count}</Badge>
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing results for "{searchMetadata.query}" in {searchMetadata.location} 
            from {searchMetadata.sources.join(', ')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="h-7">
            <Building className="mr-1 h-3 w-3" />
            All Companies
          </Badge>
          <Badge variant="secondary" className="h-7">
            <Calendar className="mr-1 h-3 w-3" />
            Any Date
          </Badge>
        </div>
      </div>

      {results.length > 0 ? (
        <div ref={resultsRef} className="space-y-4">
          {results.map((job) => (
            <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.role}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{job.source}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Job
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No matching jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSearchResults;
