import { Scale, AlertTriangle, Users, Ban, RefreshCw, Mail } from 'lucide-react';

const SECTIONS = [
  {
    icon: Users,
    title: 'Who Can Use This Platform',
    content: [
      'CancerProgressionAtlas is open to anyone who wishes to contribute cancer imaging data or access the public dataset for research, education, or AI development.',
      'By uploading data, you confirm that you are the patient whose imaging is being uploaded, a legal guardian or authorized representative of that patient, or a healthcare provider with documented patient consent for de-identified research use.',
      'You must be at least 18 years old to create an account. Minors may contribute data only with documented guardian consent.',
      'You agree not to upload imaging data belonging to any other person without their explicit written consent.',
    ],
  },
  {
    icon: Scale,
    title: 'Your Contributions',
    content: [
      'When you upload imaging data, you grant CancerProgressionAtlas a perpetual, irrevocable, royalty-free, worldwide license to store, process, de-identify, and distribute your contribution under the Creative Commons CC BY 4.0 license.',
      'You retain ownership of your original imaging data. The license you grant covers only the de-identified, anonymized version stored in the platform.',
      'You represent and warrant that you have the legal right to upload the data and grant this license.',
      'You understand that once approved and incorporated into the public dataset, removal of your data from derived AI models or third-party copies is technically infeasible, though we will delete source data upon request.',
      'Do not upload imaging that contains visible faces, names on scan labels, or any other identifying information. Our automated pipeline will strip DICOM headers, but you are responsible for visible PHI in image pixel data.',
    ],
  },
  {
    icon: Ban,
    title: 'Prohibited Uses',
    content: [
      'You may not use this platform to upload synthetic, fabricated, or misleading imaging data.',
      'You may not attempt to re-identify individuals from the anonymized dataset.',
      'You may not use the dataset or platform for surveillance, insurance discrimination, or any purpose that could harm contributors.',
      'You may not scrape the platform or dataset in ways that violate reasonable rate limits or that circumvent access controls.',
      'You may not upload content that infringes intellectual property rights, including proprietary imaging from hospitals or clinics without institutional authorization.',
      'Commercial use of the platform API requires prior written agreement.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Disclaimers & Liability',
    content: [
      'CancerProgressionAtlas is a research tool and is NOT a medical device. Nothing on this platform constitutes medical advice, diagnosis, or treatment.',
      'The dataset is provided "as-is" without warranty of accuracy, completeness, or fitness for any particular purpose.',
      'We are not liable for decisions made by AI models trained on this dataset, nor for any clinical outcomes.',
      'Researchers and developers using this dataset are solely responsible for validation and safety testing of any models or tools they build.',
      'We reserve the right to reject, remove, or flag any submission that does not meet quality or consent standards.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Changes to These Terms',
    content: [
      'We may update these Terms of Use at any time. Material changes will be announced via the GitHub repository.',
      'Continued use of the platform after changes constitutes acceptance of the updated terms.',
      'Contributions made under prior terms remain governed by the version in effect at the time of submission.',
      'Current version: 1.0 (April 2025)',
    ],
  },
  {
    icon: Mail,
    title: 'Contact',
    content: [
      'For questions about these terms, permitted uses, or licensing inquiries, please open a GitHub issue in the CancerProgressionAtlas repository.',
      'For urgent legal or compliance concerns, use the contact information in the repository README.',
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#c8dff0' }}>Terms of Use</h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#6a8fa8' }}>
            <span>Effective: April 2025</span>
            <span>·</span>
            <span>Version 1.0</span>
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(0, 230, 118, 0.06)', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
              <span style={{ color: '#c8dff0' }}>Short version:</span> Upload only your own imaging or data you have permission to share.
              Don't re-identify people. This is a research tool — not medical advice.
              Contributions are licensed CC BY 4.0 to the world.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {SECTIONS.map(({ icon: Icon, title, content }) => (
            <div key={title} className="p-7 rounded-2xl glass">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#00d4ff' }} />
                </span>
                {title}
              </h2>
              <ul className="space-y-3">
                {content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#1a3a5c' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
