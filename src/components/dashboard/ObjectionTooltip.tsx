interface ObjectionTooltipContentProps {
  type: 'category' | 'top3';
}

const objectionDescriptions = [
  'Pricing – Too Expensive : Prospect says Versa costs more than competitors or isn\'t worth the price.',
  'Pricing – Value Doubts : Prospect doesn\'t see enough value/ROI for Versa\'s pricing.',
  'Product – Missing Features : Feature gaps compared to competitors (e.g., no ZTNA, poor NGFW).',
  'Product – Poor Integration : Lacks integrations with current tools or platforms.',
  'Product – Performance Concerns : Complaints about reliability, latency, speed, or scale.',
  'Competitor – Strong Reputation : Competitor is praised for being an industry standard or market leader.',
  'Competitor – Existing Usage : Competitor already in use and hard to displace (e.g., "we already use X").',
  'Trust – Brand Recognition : Versa is seen as less known or trusted than competitor.',
  'Trust – Company Stability : Prospect is unsure about Versa\'s long-term viability.',
  'Implementation – Complexity : Prospect believes Versa is harder to deploy/configure than others.',
  'Implementation – Migration Risk : Concern over downtime or risk in switching from existing solution.',
  'Security – Capability Doubt : Prospect doubts Versa\'s security features match competitor\'s.',
  'Security – Compliance Gaps : Prospect highlights missing certifications or compliance risks.',
  'Support – Poor Service : Concerns about Versa\'s responsiveness, SLAs, or past support experience.',
  'Other : Doesn\'t clearly fit any above but still reflects a hurdle.',
];

export function ObjectionTooltipContent({ type }: ObjectionTooltipContentProps) {
  return (
    <div className="space-y-3">
      {objectionDescriptions.map((description) => {
        const [category, details] = description.split(' : ');
        return (
          <div key={category} className="text-sm leading-relaxed">
            <span className="font-semibold text-gray-900">{category}</span>
            <span className="text-gray-600"> : {details}</span>
          </div>
        );
      })}
    </div>
  );
} 