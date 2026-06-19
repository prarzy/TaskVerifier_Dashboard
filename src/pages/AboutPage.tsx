import { AlertTriangle, BookOpen } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <div className="text-sm text-text-secondary leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function FlowDiagram({ steps, label }: { steps: { node: string; sub?: string }[]; label: string }) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6">
      <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-5">{label}</div>
      <div className="flex flex-wrap items-stretch gap-3">
        {steps.map((s, i) => (
          <div key={s.node} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5 w-32">
              <div className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-center border border-accent-blue/30 bg-accent-blue/5 text-accent-blue-glow">
                {s.node}
              </div>
              {s.sub && <div className="text-[10px] text-text-dim text-center leading-snug">{s.sub}</div>}
            </div>
            {i < steps.length - 1 && (
              <div className="text-text-dim text-sm flex-shrink-0 self-start mt-2.5">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="p-10 space-y-10 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary">About TaskVerifier</h2>
        <p className="text-sm text-text-muted">Research documentation and project context.</p>
      </div>

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
          single-shot generation misses this gap. TaskVerifier tests whether closed-loop feedback, grounded in
          real execution outputs, enables the model to converge on a working exploit.
        </p>
      </Section>

      <Section title="Project Goals">
        <ul className="list-disc list-inside space-y-1.5 text-text-muted">
          <li>Quantify improvement in PoC generation success via iterative feedback</li>
          <li>Characterize which vulnerability classes benefit most from feedback</li>
          <li>Study hallucination rates across attempts</li>
          <li>Compare TaskVerifier against single-attempt baseline generation</li>
          <li>Identify failure modes — compilation, execution, sanitizer non-trigger</li>
        </ul>
      </Section>

      <Section title="CyberGym / ARVO Benchmark">
        <p>
          CyberGym is an automated vulnerability benchmark derived from real-world CVEs. The ARVO subset provides
          pre-built Docker images with vulnerable binaries, fuzzer harnesses, and expected sanitizer outputs,
          enabling reproducible evaluation of PoC generation systems.
        </p>
      </Section>

      {/* Architecture diagrams — full width, stacked, spaced apart */}
      <div className="space-y-6 pt-2">
        <FlowDiagram
          label="TaskVerifier Workflow"
          steps={[
            { node: 'CVE', sub: 'CyberGym ARVO entry' },
            { node: 'Prompt', sub: 'Source context injected' },
            { node: 'LLM', sub: 'Generates PoC code' },
            { node: 'PoC', sub: 'C/C++ exploit candidate' },
            { node: 'Verifier', sub: 'Compile → Execute → Sanitizer' },
            { node: 'Feedback', sub: 'Structured error extraction' },
            { node: 'Retry', sub: 'Up to max attempts' },
            { node: 'Result', sub: 'PASS or FAIL' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlowDiagram
            label="Verifier Pipeline"
            steps={[
              { node: 'Compile', sub: 'GCC/Clang + sanitizer flags' },
              { node: 'Execute', sub: 'Run in Docker sandbox' },
              { node: 'Sanitizer', sub: 'ASAN / MSAN / UBSAN' },
              { node: 'Feedback', sub: 'Error → LLM context' },
            ]}
          />

          <FlowDiagram
            label="Experiment Flow"
            steps={[
              { node: 'Dataset', sub: 'dataset.json' },
              { node: 'Runner', sub: 'Iterates CVE list' },
              { node: 'Agent', sub: 'LLM generates PoC' },
              { node: 'Verifier', sub: 'Compile + extract' },
              { node: 'Results', sub: 'Logged outcomes' },
            ]}
          />
        </div>
      </div>

      <Section title="Future Work">
        <ul className="list-disc list-inside space-y-1.5 text-text-muted">
          <li>Expand to 50+ ARVO CVEs across broader vulnerability classes</li>
          <li>Compare multiple LLMs across providers</li>
          <li>Study prompt engineering strategies for harder CVE classes</li>
          <li>Quantify token cost vs. success rate tradeoffs</li>
          <li>Evaluate hallucination mitigation strategies</li>
        </ul>
      </Section>

      {/* Agent loop note */}
      <div className="flex items-start gap-3 rounded-xl border border-bg-border bg-bg-card p-5 text-sm text-text-muted">
        <BookOpen size={16} className="flex-shrink-0 mt-0.5 text-accent-blue" />
        <div className="space-y-1">
          <div className="text-text-secondary font-medium">Agent Loop</div>
          <p className="leading-relaxed">
            The agent loop maintains a persistent context across attempts, using tiktoken-based budgeting to
            inject source context on attempt 1 and structured feedback on retries. A failure ledger tracks
            previously tried strategies to avoid repetition.
          </p>
        </div>
      </div>

      {/* Sanitizer legend */}
      <div className="rounded-xl border border-bg-border bg-bg-card p-5 space-y-3">
        <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sanitizer Legend</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'ASAN', desc: 'AddressSanitizer — heap buffer overflow, use-after-free', color: '#ef4444' },
            { name: 'MSAN', desc: 'MemorySanitizer — uninitialized memory reads', color: '#8b5cf6' },
            { name: 'UBSAN', desc: 'UndefinedBehaviorSanitizer — type errors, overflow', color: '#f59e0b' },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <span
                className="px-2 py-0.5 rounded text-xs font-bold font-mono w-fit"
                style={{ background: `${item.color}22`, color: item.color }}
              >
                {item.name}
              </span>
              <span className="text-text-muted text-xs leading-relaxed">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Section title="Ethical Considerations">
        <div className="flex items-start gap-3 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-4 text-sm text-accent-amber leading-relaxed">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <span>
            This research involves generation of PoC exploit code for known, publicly disclosed vulnerabilities in
            controlled sandbox environments. All experiments are conducted on isolated Docker containers. Results
            are intended for academic research and responsible disclosure practices only.
          </span>
        </div>
      </Section>
    </div>
  );
}
