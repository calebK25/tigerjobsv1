import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network } from "lucide-react";
import SankeyDiagram from "@/components/analytics/SankeyDiagram";
import SankeyLegend from "@/components/analytics/SankeyLegend";
import { useInterviews } from "@/context/InterviewContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const AnalyticsAppFlowCard: React.FC = () => {
  const { interviews } = useInterviews();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate headers (animation remains for subcomponent)
    if (!headerRef.current || !contentRef.current) return;
    import('gsap').then(({ default: gsap }) => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
      timeline.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.6 },
        "-=0.3"
      );
    });
  }, []);

  return (
    <section className="w-full">
      <div ref={headerRef} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Application Flow</h2>
          <p className="text-muted-foreground">Comprehensive Sankey diagram of your application journey</p>
        </div>
        <Network className="h-6 w-6 text-muted-foreground" />
      </div>
      <div ref={contentRef} className="mt-2 w-full">
        <Card className="border border-border/50 shadow-lg overflow-hidden w-full">
          <CardContent className="p-0">
            <ScrollArea className="w-full" style={{ maxHeight: "700px" }}>
              {/* Remove min-w-full from this wrapper */}
              <div className="border-t rounded-b-md bg-white dark:bg-black/10 shadow-inner w-full">
                <SankeyDiagram interviews={interviews} />
              </div>
            </ScrollArea>
            <SankeyLegend />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AnalyticsAppFlowCard;
