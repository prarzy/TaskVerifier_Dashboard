import { AlertTriangle, BookOpen } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary border-b border-bg-border pb-2">{title}</h3>
      <div className="text-sm text-text-secondary leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function FlowDiagram({ steps, label }: { steps: { node: string; sub?: string }[]; label: string }) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-5">
      <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4">{label}</div>
      <div className="flex flex-col gap-0">
        {steps.map((s, i) => (
          <div key={s.node} className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <div className="w-32 px-3 py-2 rounded-lg text-xs font-semibold text-center border border-accent-blue/30 bg-accent-blue/5 text-accent-blue-glow">
                {s.node}
              </div>
              {s.sub && <div className="text-[10px] text-text-dim">{s.sub}</div>}
            </div>
            {i < steps.length - 1 && (
              <div className="ml-14 text-text-dim text-xs leading-none py-0.5">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">About TaskVerifier</h2>
        <p className="text-sm text-text-muted">Research documentation and project context.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <Section title="What is TaskVerifier?">
            <p>
              TaskVerifier is a research system that evaluates whether <em>structured execution feedback</em> improves
              an LLM's ability to generate working Proof-of-Concept (PoC) exploit code for known vulnerabilities.
            </p>
            <p>
              Rather than generating a single PoC and accepting it, TaskVerifier runs each attempt through a verifier
              pipeline, extracts compiler and sanitizer errors, and feeds structured feedback back to the model for
              iterative refinement.
            </p>
          </Section>

          <Section title="Research Motivation">
            <p>
              LLMs can generate syntactically valid code that fails to trigger a vulnerability at runtime. Traditional
              single-shot generation misses this gap. TaskVerifier tests whether closed-loop feedback — grounded in
              real execution outputs — enables the model to converge on a working exploit.
            </p>
          </Section>

          <Section title="Project Goals">
            <ul className="list-disc list-inside space-y-1 text-text-muted text-xs">
              <li>Quantify improvement in PoC generation success via iterative feedback</li>
              <li>Characterize which vulnerability classes benefit most from feedback</li>
              <li>Study hallucination rates across attempts</li>
              <li>Compare TaskVerifier against single-attempt baseline generation</li>
              <li>Identify failure modes (compilation, execution, sanitizer non-trigger)</li>
            </ul>
          </Section>

          <Section title="CyberGym / ARVO Benchmark">
            <p>
              CyberGym is an automated vulnerability benchmark derived from real-world CVEs. The ARVO subset provides
              pre-built Docker images with vulnerable binaries, fuzzer harnesses, and expected sanitizer outputs,
              enabling reproducible evaluation of PoC generation systems.
            </p>
          </Section>

          <Section title="Future Work">
            <ul className="list-disc list-inside space-y-1 text-text-muted text-xs">
              <li>Expand to 50+ ARVO CVEs across broader vulnerability classes</li>
              <li>Compare multiple LLMs (GPT-4o, Gemini, local models)</li>
              <li>Study prompt engineering strategies for harder CVE classes</li>
              <li>Quantify token cost vs. success rate tradeoffs</li>
              <li>Evaluate hallucination mitigation strategies</li>
            </ul>
          </Section>

          <Section title="Ethical Considerations">
            <div className="flex items-start gap-2 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-3 text-xs text-accent-amber">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                This research involves generation of PoC exploit code for known, publicly disclosed vulnerabilities in
                controlled sandbox environments. All experiments are conducted on isolated Docker containers. Results
                are intended for academic research and responsible disclosure practices only.
              </span>
            </div>
          </Section>
        </div>

        {/* Right column — Diagrams */}
        <div className="space-y-5">
          <FlowDiagram
            label="TaskVerifier Workflow"
            steps={[
              { node: 'CVE', sub: 'CyberGym ARVO benchmark entry' },
              { node: 'Prompt', sub: 'Source context + task injected' },
              { node: 'LLM', sub: 'Generates PoC code' },
              { node: 'PoC', sub: 'C/C++ exploit candidate' },
              { node: 'Verifier', sub: 'Compile → Execute → Sanitizer' },
              { node: 'Feedback', sub: 'Structured error extraction' },
              { node: 'Retry', sub: 'Up to max_attempts iterations' },
              { node: 'Result', sub: 'PASS (crash) or FAIL (exhausted)' },
            ]}
          />

          <FlowDiagram
            label="Verifier Pipeline"
            steps={[
              { node: 'Compile', sub: 'GCC/Clang with sanitizer flags' },
              { node: 'Execute', sub: 'Run in Docker sandbox' },
              { node: 'Sanitizer', sub: 'ASAN / MSAN / UBSAN intercept' },
              { node: 'Feedback', sub: 'Structured error → LLM context' },
            ]}
          />

          <FlowDiagram
            label="Experiment Flow"
            steps={[
              { node: 'Dataset', sub: 'dataset.json with CVE entries' },
              { node: 'Runner', sub: 'Iterates over CVE list' },
              { node: 'Agent', sub: 'LLM generates PoC per attempt' },
              { node: 'Verifier', sub: 'Compile + execute + extract' },
              { node: 'Results', sub: 'Per-CVE outcomes logged to JSON' },
            ]}
          />

          {/* Legend */}
          <div className="rounded-xl border border-bg-border bg-bg-card p-4 space-y-2">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sanitizer Legend</div>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
              {[
                ['ASAN', 'AddressSanitizer — heap buffer overflow, use-after-free', '#ef4444'],
                ['MSAN', 'MemorySanitizer — uninitialized memory reads', '#8b5cf6'],
                ['UBSAN', 'UndefinedBehaviorSanitizer — type errors, overflow', '#f59e0b'],
              ].map(([name, desc, color]) => (
                <div key={name} className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${color}22`, color }}>
                    {name}
                  </span>
                  <span className="text-text-muted text-[11px]">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-bg-border bg-bg-card p-4 text-xs text-text-muted">
            <BookOpen size={14} className="flex-shrink-0 mt-0.5 text-accent-blue" />
            <div>
              <div className="text-text-secondary font-medium mb-1">Agent Loop</div>
              The agent loop maintains a persistent context across attempts, using tiktoken-based budgeting to
              inject source context on attempt 1 and structured feedback on retries. A failure ledger tracks
              previously tried strategies to avoid repetition.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
