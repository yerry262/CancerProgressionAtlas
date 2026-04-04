import { BookOpen, Code, Share2, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

export default function License() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#c8dff0' }}>Dataset License</h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold mono" style={{ background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
              Dataset: CC BY 4.0
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold mono" style={{ background: 'rgba(0, 230, 118, 0.1)', color: '#00e676', border: '1px solid rgba(0, 230, 118, 0.3)' }}>
              Software: MIT License
            </span>
          </div>
        </div>

        {/* CC BY 4.0 */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <BookOpen className="w-4 h-4" style={{ color: '#00d4ff' }} />
            </span>
            Dataset: Creative Commons CC BY 4.0
          </h2>
          <p className="text-xs mb-5 mono" style={{ color: '#3d5a73' }}>Creative Commons Attribution 4.0 International</p>

          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6a8fa8' }}>
            The CancerProgressionAtlas imaging dataset is released under the{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-[#00d4ff] transition-colors" style={{ color: '#c8dff0' }}>
              Creative Commons Attribution 4.0 International (CC BY 4.0)
            </a>{' '}
            license. This means anyone — individuals, companies, researchers, and non-profits —
            may freely use this dataset under the following conditions.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00e676' }}>You Are Free To</p>
              {[
                { icon: CheckCircle, text: 'Share — copy and redistribute the dataset in any medium or format' },
                { icon: CheckCircle, text: 'Adapt — remix, transform, and build upon the dataset' },
                { icon: CheckCircle, text: 'Use commercially — including for commercial AI products' },
                { icon: CheckCircle, text: 'Use for academic research and publications' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex gap-2 mb-2 text-sm" style={{ color: '#6a8fa8' }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} />
                  {text}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#ff9d00' }}>Under These Conditions</p>
              {[
                { icon: AlertTriangle, text: 'Attribution — credit "CancerProgressionAtlas Contributors" in any work using this data' },
                { icon: AlertTriangle, text: 'No additional restrictions — you may not apply legal terms that restrict others from the freedoms granted here' },
                { icon: AlertTriangle, text: 'No re-identification — attempting to identify individuals is prohibited' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex gap-2 mb-2 text-sm" style={{ color: '#6a8fa8' }}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ff9d00' }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl font-mono text-xs leading-relaxed" style={{ background: 'rgba(0, 0, 0, 0.3)', color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}>
            <p style={{ color: '#c8dff0' }}>Suggested attribution:</p>
            <p className="mt-1">CancerProgressionAtlas Contributors. (2025). CancerProgressionAtlas: Open-source crowdsourced cancer imaging dataset [Data set]. Licensed under CC BY 4.0. https://yerry262.github.io/CancerProgressionAtlas/</p>
          </div>
        </div>

        {/* MIT License */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
              <Code className="w-4 h-4" style={{ color: '#00e676' }} />
            </span>
            Platform Code: MIT License
          </h2>
          <p className="text-xs mb-5 mono" style={{ color: '#3d5a73' }}>Applies to all source code in the GitHub repository</p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: '#6a8fa8' }}>
            The CancerProgressionAtlas web platform (frontend, backend, scripts) is released under the MIT License.
            You are free to fork, modify, and deploy your own instance.
          </p>

          <div className="p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ background: 'rgba(0, 0, 0, 0.3)', color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}>{`MIT License

Copyright (c) 2025 CancerProgressionAtlas Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`}</div>
        </div>

        {/* Commercial use */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <DollarSign className="w-4 h-4" style={{ color: '#00d4ff' }} />
            </span>
            Commercial Use
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
            <p>CC BY 4.0 permits commercial use of the dataset. You may train proprietary AI models, include this data in commercial products, and publish findings without seeking additional permission — as long as you provide attribution.</p>
            <p>We believe open data accelerates medical AI progress. Restricting commercial use would limit the dataset's impact on real-world clinical tools that could save lives.</p>
            <p>
              <span style={{ color: '#c8dff0' }}>API commercialization:</span> If you wish to build a commercial product that directly re-hosts or wraps the CancerProgressionAtlas API (rather than downloading and self-hosting the dataset), please contact us via GitHub to discuss terms.
            </p>
          </div>
        </div>

        {/* Third-party */}
        <div className="p-7 rounded-2xl glass">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <Share2 className="w-4 h-4" style={{ color: '#00d4ff' }} />
            </span>
            Third-Party Licenses
          </h2>
          <ul className="space-y-3">
            {[
              'React, Vite, Tailwind CSS — MIT License',
              'Express.js, PostgreSQL client (pg) — MIT License',
              'dicom-parser — MIT License',
              'Lucide React icons — ISC License',
              'react-hook-form, zod — MIT License',
              'Fonts: Inter, JetBrains Mono — SIL Open Font License 1.1',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: '#6a8fa8' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#1a3a5c' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
