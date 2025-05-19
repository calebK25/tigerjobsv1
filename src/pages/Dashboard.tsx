import React, { useEffect, useRef } from 'react';
import { useInterviews } from '@/context/InterviewContext';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import InterviewForm from '@/components/interviews/InterviewForm';
import gsap from 'gsap';
import StatsCard from '@/components/dashboard/StatsCard';
import StatusChart from '@/components/dashboard/StatusChart';
import UpcomingInterviews from '@/components/dashboard/UpcomingInterviews';

const Dashboard = () => {
  const { interviews } = useInterviews();
  const [formOpen, setFormOpen] = React.useState(false);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" }
    });
    
    if (headerRef.current) {
      timeline.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      );
    }
    
    if (statsRef.current) {
      timeline.fromTo(
        statsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.5 },
        "-=0.2"
      );
    }
    
    if (chartsRef.current) {
      timeline.fromTo(
        chartsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.6 },
        "-=0.3"
      );
    }
  }, []);

  const metrics = {
    totalApplications: interviews.length,
    upcomingInterviews: interviews.filter(i => i.status === 'Interviewing' && i.nextInterviewDate).length,
    offersReceived: interviews.filter(i => i.status === 'Offer').length,
  };

  return (
    <div className="space-y-8">
      <div ref={headerRef} className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-pulse-slow">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your application journey</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <Plus className="h-4 w-4" />
          Add Interview
        </Button>
      </div>

      <div ref={statsRef} className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <StatsCard
          title="Applications"
          value={metrics.totalApplications}
          icon={Briefcase}
          progress={metrics.totalApplications > 0 ? Math.min(metrics.totalApplications / 10 * 100, 100) : 0}
        />
        <StatsCard
          title="Upcoming"
          value={metrics.upcomingInterviews}
          icon={Calendar}
          progress={metrics.upcomingInterviews > 0 ? Math.min(metrics.upcomingInterviews / 5 * 100, 100) : 0}
        />
        <StatsCard
          title="Offers"
          value={metrics.offersReceived}
          icon={CheckCircle2}
          progress={metrics.offersReceived > 0 ? Math.min(metrics.offersReceived / 3 * 100, 100) : 0}
        />
      </div>

      <div ref={chartsRef} className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <StatusChart interviews={interviews} />
        <UpcomingInterviews interviews={interviews} />
      </div>

      <InterviewForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};

export default Dashboard;
