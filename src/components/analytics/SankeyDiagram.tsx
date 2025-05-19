import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Interview } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface SankeyDiagramProps {
  interviews: Interview[];
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ interviews }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    renderSankeyDiagram();

    // Responsive re-render on resize
    const handleResize = () => {
      renderSankeyDiagram();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, [interviews, isMobile]);

  const renderSankeyDiagram = () => {
    if (!svgRef.current) return;
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Sankey Data
    const appliedCount = interviews.filter(i => i.status === 'Applied').length;
    const interviewingCount = interviews.filter(i => i.status === 'Interviewing').length;
    const offerCount = interviews.filter(i => i.status === 'Offer').length;
    const rejectedCount = interviews.filter(i => i.status === 'Rejected').length;

    if (appliedCount + interviewingCount + offerCount + rejectedCount === 0) {
      const noDataText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      noDataText.setAttribute('x', '50%');
      noDataText.setAttribute('y', '50%');
      noDataText.setAttribute('text-anchor', 'middle');
      noDataText.setAttribute('font-size', '16');
      noDataText.setAttribute('fill', 'var(--sankey-text, currentColor)');
      noDataText.setAttribute('class', 'no-data-message');
      noDataText.textContent = 'No application data to display';
      svgRef.current.appendChild(noDataText);
      return;
    }

    const svg = svgRef.current;
    // Make width more compact with a smaller minimum
    const containerWidth = svg.parentElement?.clientWidth || 600;
    // Min width reduced for a more compact diagram:
    const width = Math.max(600, containerWidth);
    const height = 700;
    const nodeHeight = 40;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    ['blue', 'yellow', 'green', 'red', 'gray'].forEach((color) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', `link-gradient-${color}`);
      gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '0%');
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', getColor(color, true));
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', getColor(color, false));
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    });

    const nodes = [
      { id: 'applied', name: 'Applied', category: 'initial' },
      { id: 'interviewing', name: 'Interviewing', category: 'outcome' },
      { id: 'offer', name: 'Offer', category: 'outcome' },
      { id: 'rejected', name: 'Rejected', category: 'outcome' },
    ];
    const links = [
      { source: 'applied', target: 'interviewing', value: interviewingCount || 1 },
      { source: 'applied', target: 'offer', value: offerCount || 1 },
      { source: 'applied', target: 'rejected', value: rejectedCount || 1 },
    ];

    const nodeWidth = 20;
    // Use a more dynamic gap based on # of categories, so it's always evenly distributed
    const numCategories = 2;
    const nodeGap = width / (numCategories + 1); // instead of width / 3 or / 4

    const categories = ['initial', 'outcome'];
    const categoryLabels = ['Initial Status', 'Outcome'];

    // Add category headers
    categoryLabels.forEach((label, i) => {
      const x = i * nodeGap + nodeGap / 2;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', '25');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', 'var(--sankey-category, currentColor)');
      text.setAttribute('class', 'sankey-category');
      text.textContent = label;
      svg.appendChild(text);
      gsap.fromTo(text, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1 });
    });

    // Links
    links.forEach((link, index) => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      if (sourceNode && targetNode) {
        const sourceCategoryIndex = categories.indexOf(sourceNode.category);
        const targetCategoryIndex = categories.indexOf(targetNode.category);
        const sourceNodesInCategory = nodes.filter(n => n.category === sourceNode.category);
        const targetNodesInCategory = nodes.filter(n => n.category === targetNode.category);

        const sourceIndex = sourceNodesInCategory.findIndex(n => n.id === sourceNode.id);
        const targetIndex = targetNodesInCategory.findIndex(n => n.id === targetNode.id);

        const sourceX = sourceCategoryIndex * nodeGap + nodeGap / 2 + nodeWidth / 2;
        const sourceY = 70 + (sourceIndex + 1) * (height - 100) / (sourceNodesInCategory.length + 1);
        const targetX = targetCategoryIndex * nodeGap + nodeGap / 2 - nodeWidth / 2;
        const targetY = 70 + (targetIndex + 1) * (height - 100) / (targetNodesInCategory.length + 1);

        let linkColor = 'blue';
        switch(targetNode.id) {
          case 'interviewing': linkColor = 'yellow'; break;
          case 'offer': linkColor = 'green'; break;
          case 'rejected': linkColor = 'red'; break;
          default: linkColor = 'blue';
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controlX1 = sourceX + (targetX - sourceX) / 3;
        const controlX2 = targetX - (targetX - sourceX) / 3;
        const linkValue = Math.max(3, link.value * 2);
        const d = `M ${sourceX} ${sourceY} C ${controlX1} ${sourceY}, ${controlX2} ${targetY}, ${targetX} ${targetY}`;
        path.setAttribute('d', d);
        path.setAttribute('stroke-width', linkValue.toString());
        path.setAttribute('stroke', `url(#link-gradient-${linkColor})`);
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.7');
        path.setAttribute('class', 'sankey-link');
        path.setAttribute('data-source', sourceNode.id);
        path.setAttribute('data-target', targetNode.id);
        path.setAttribute('data-original-width', linkValue.toString());
        svg.appendChild(path);

        const pathLength = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: pathLength, strokeDashoffset: pathLength },
          { strokeDashoffset: 0, duration: 1.5, ease: "power3.inOut", delay: 0.5 + index * 0.02 }
        );
      }
    });

    // Nodes
    categories.forEach((category, categoryIndex) => {
      const nodesInCategory = nodes.filter(n => n.category === category);
      const x = categoryIndex * nodeGap + nodeGap / 2;
      nodesInCategory.forEach((node, nodeIndex) => {
        const y = 70 + (nodeIndex + 1) * (height - 100) / (nodesInCategory.length + 1);
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'sankey-node-group');
        nodeGroup.setAttribute('data-node-id', node.id);
        svg.appendChild(nodeGroup);
        const nodeBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nodeBackground.setAttribute('x', (x - nodeWidth / 2 - 4).toString());
        nodeBackground.setAttribute('y', (y - nodeHeight / 2 - 4).toString());
        nodeBackground.setAttribute('width', (nodeWidth + 8).toString());
        nodeBackground.setAttribute('height', (nodeHeight + 8).toString());
        nodeBackground.setAttribute('rx', '6');
        nodeBackground.setAttribute('fill', 'rgba(0,0,0,0.05)');
        nodeBackground.setAttribute('class', 'sankey-node-bg');
        nodeGroup.appendChild(nodeBackground);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', (x - nodeWidth / 2).toString());
        rect.setAttribute('y', (y - nodeHeight / 2).toString());
        rect.setAttribute('width', nodeWidth.toString());
        rect.setAttribute('height', nodeHeight.toString());
        rect.setAttribute('rx', '4');
        let fillColor = 'var(--primary)';
        switch(node.id) {
          case 'applied': fillColor = getColor('blue', false); break;
          case 'interviewing': fillColor = getColor('yellow', false); break;
          case 'offer': fillColor = getColor('green', false); break;
          case 'rejected': fillColor = getColor('red', false); break;
          default: fillColor = getColor('gray', false); break;
        }
        rect.setAttribute('fill', fillColor);
        rect.setAttribute('class', 'sankey-node');
        rect.setAttribute('id', `node-${node.id}`);
        nodeGroup.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        if (categoryIndex === 0) {
          text.setAttribute('x', (x + nodeWidth / 2 + 10).toString());
          text.setAttribute('text-anchor', 'start');
        } else {
          text.setAttribute('x', (x - nodeWidth / 2 - 10).toString());
          text.setAttribute('text-anchor', 'end');
        }
        text.setAttribute('y', y.toString());
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', 'var(--sankey-label, currentColor)');
        text.setAttribute('class', 'sankey-label');
        text.textContent = node.name;
        nodeGroup.appendChild(text);

        let count = 0;
        switch(node.id) {
          case 'applied': count = appliedCount; break;
          case 'interviewing': count = interviewingCount; break;
          case 'offer': count = offerCount; break;
          case 'rejected': count = rejectedCount; break;
          default: count = 0;
        }
        if (count > 0) {
          const countBadge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          countBadge.setAttribute('cx', (x + nodeWidth / 2 + 5).toString());
          countBadge.setAttribute('cy', (y - nodeHeight / 2 + 5).toString());
          countBadge.setAttribute('r', '8');
          countBadge.setAttribute('fill', 'var(--primary)');
          countBadge.setAttribute('class', 'count-badge');
          nodeGroup.appendChild(countBadge);

          const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          countText.setAttribute('x', (x + nodeWidth / 2 + 5).toString());
          countText.setAttribute('y', (y - nodeHeight / 2 + 5).toString());
          countText.setAttribute('text-anchor', 'middle');
          countText.setAttribute('dominant-baseline', 'middle');
          countText.setAttribute('font-size', '8');
          countText.setAttribute('fill', 'white');
          countText.setAttribute('class', 'count-text');
          countText.textContent = count.toString();
          nodeGroup.appendChild(countText);
        }

        gsap.fromTo(nodeGroup,
          { opacity: 0, scale: 0.8, transformOrigin: 'center' },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", delay: 0.2 + categoryIndex * 0.1 + nodeIndex * 0.05 }
        );

        nodeGroup.addEventListener('mouseenter', () => {
          gsap.to(nodeGroup, { scale: 1.1, duration: 0.2 });
          const nodeLinks = document.querySelectorAll(`.sankey-link[data-source="${node.id}"], .sankey-link[data-target="${node.id}"]`);
          nodeLinks.forEach(link => {
            gsap.to(link, {
              opacity: 1,
              strokeWidth: parseInt(link.getAttribute('data-original-width') || '2') * 1.5,
              duration: 0.2
            });
          });
        });

        nodeGroup.addEventListener('mouseleave', () => {
          gsap.to(nodeGroup, { scale: 1, duration: 0.2 });
          const nodeLinks = document.querySelectorAll(`.sankey-link[data-source="${node.id}"], .sankey-link[data-target="${node.id}"]`);
          nodeLinks.forEach(link => {
            gsap.to(link, {
              opacity: 0.7,
              strokeWidth: link.getAttribute('data-original-width'),
              duration: 0.2
            });
          });
        });
      });
    });
  };

  function getColor(color: string, isStart: boolean = false): string {
    switch(color) {
      case 'blue': return isStart ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 1)';
      case 'yellow': return isStart ? 'rgba(234, 179, 8, 0.7)' : 'rgba(234, 179, 8, 1)';
      case 'green': return isStart ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 1)';
      case 'red': return isStart ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 1)';
      case 'gray': return isStart ? 'rgba(156, 163, 175, 0.7)' : 'rgba(156, 163, 175, 1)';
      default: return isStart ? 'rgba(var(--primary), 0.7)' : 'rgb(var(--primary))';
    }
  }

  return (
    <svg
      ref={svgRef}
      className="w-full h-[700px] max-w-full"
      style={{ display: 'block', maxWidth: '100%', minWidth: '0' }}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default SankeyDiagram;
