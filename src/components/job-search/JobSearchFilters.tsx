
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Filter, Calendar, MapPin, Briefcase, Building, Clock } from 'lucide-react';

const JobSearchFilters = () => {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Badge variant="outline" className="cursor-pointer">
            <Filter className="mr-1 h-3 w-3" />
            Clear All
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <Accordion type="multiple" defaultValue={["date", "jobType"]}>
          <AccordionItem value="date" className="border-b">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Date Posted</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2">
                {["Past 24 hours", "Past week", "Past month", "Any time"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`date-${option}`} />
                    <Label htmlFor={`date-${option}`} className="text-sm font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="jobType" className="border-b">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>Job Type</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2">
                {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`type-${option}`} />
                    <Label htmlFor={`type-${option}`} className="text-sm font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="experience" className="border-b">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Experience Level</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2">
                {["Entry level", "Mid level", "Senior level", "Director", "Executive"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`exp-${option}`} />
                    <Label htmlFor={`exp-${option}`} className="text-sm font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="salary" className="border-b">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                <span>Salary Range</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-4">
                <div className="pt-2">
                  <Slider defaultValue={[40000, 100000]} min={0} max={200000} step={5000} />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$40,000</span>
                  <span>$100,000+</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="location" className="border-b">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Location</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2">
                {["Remote", "Hybrid", "On-site", "Within 10 miles", "Within 25 miles", "Within 50 miles"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`loc-${option}`} />
                    <Label htmlFor={`loc-${option}`} className="text-sm font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default JobSearchFilters;
