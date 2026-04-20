export type Severity = 'critical' | 'high' | 'medium' | 'pass'

export interface Finding {
  id: string
  title: string
  desc: string
  evidence: string
  severity: Severity
}

export const findings: Finding[] = [
  {
    id: 'F-01',
    title: 'No rate limiting on any endpoint',
    desc: '100+ sequential and concurrent requests completed without a single 429. Any actor with a valid key can exhaust the entire token quota in under 2 minutes at 30 concurrent threads — no throttling, no cooldown.',
    evidence: 'Reproduced: 30 sequential + 20 concurrent + 50 thundering herd — 0/100 requests rate limited',
    severity: 'critical',
  },
  {
    id: 'F-02',
    title: 'Billed full tokens, returned empty output',
    desc: 'Setting target_tokens=1 returns pruned_tokens=0 with an empty compressed string, but tokens_used is charged in full. No error, no warning. A downstream pipeline silently receives an empty prompt with no indication anything failed.',
    evidence: 'Reproduced twice: tests 2a and 2j-i — 3,357 tokens billed, 0 pruned tokens returned',
    severity: 'critical',
  },
  {
    id: 'F-03',
    title: 'Prompt injection survives compression into output',
    desc: 'Injection payloads — role escalation, buried mid-content instructions, foreign-language commands, ChatML tokens — are preserved in compressed output. If the output feeds a downstream LLM, the injected instructions execute there.',
    evidence: '9/10 injection tests flagged: keywords ignore, pwned, override, disregard, you are now, system prompt all survived',
    severity: 'critical',
  },
  {
    id: 'F-04',
    title: 'GET endpoint silently fails above ~6,700 tokens',
    desc: 'GET /compress-text returns a raw Cloudflare 414 HTML page (not JSON) beyond ~25k chars. The limit is undocumented and breaks any client expecting structured errors. POST bypasses this entirely — up to 500k chars.',
    evidence: 'GET: 414 at 25k tokens | POST: success at 100k tokens | Hard limit 500,000 chars on POST body',
    severity: 'high',
  },
  {
    id: 'F-05',
    title: 'query param is an unfiltered injection channel',
    desc: 'The query field value is concatenated directly onto the compressed output without sanitization. Any string — role overrides, ChatML special tokens, system prompt requests — passes through completely unmodified.',
    evidence: 'Tests 2a–2e: full query strings including <|im_start|>system tokens preserved verbatim in output',
    severity: 'high',
  },
  {
    id: 'F-06',
    title: 'Pathological input billed but returns zero tokens',
    desc: '5,000 levels of nested brackets with minimal content was accepted, billed at 2,501 tokens, but returned pruned_tokens=0. The compressor silently fails on structurally abnormal input with no error returned.',
    evidence: 'Input: 10,005 chars of nested brackets | billed: 2,501 tokens | output: empty string',
    severity: 'high',
  },
  {
    id: 'F-07',
    title: 'target_tokens > input silently re-compresses instead of passthrough',
    desc: 'When target_tokens exceeds the input token count, the API compresses to ~90% retention instead of returning the input unchanged. Undocumented behavior — developers expecting a passthrough silently lose ~10% of content.',
    evidence: 'target_tokens=9,999,999 on 3,357 token input → pruned=3,113 (92.7% kept, not 100%)',
    severity: 'medium',
  },
  {
    id: 'F-08',
    title: 'GET used for large text payloads — architectural antipattern',
    desc: 'Passing large text via URL query parameters is non-standard. Content appears in server logs, proxy history, and browser history. The 414 limit is a direct consequence. All large text should go via POST body.',
    evidence: 'Both GET and POST /compress-text are documented — GET routes text via query params',
    severity: 'medium',
  },
  {
    id: 'F-09',
    title: 'No prompt caching detected — privacy positive',
    desc: '10 identical requests returned consistent ~540ms latency with only 165ms variance. No cache hit outliers detected, meaning prompt content is not stored and potentially returned to other users.',
    evidence: 'Avg: 540ms | Min: 479ms | Max: 644ms | Variance: 165ms — no sub-100ms outliers',
    severity: 'pass',
  },
]

export const severityOrder: Record<Severity, number> = {
  critical: 0, high: 1, medium: 2, pass: 3,
}

export const severityColors: Record<Severity, { badge: string; dot: string; border: string }> = {
  critical: {
    badge: 'bg-[#1f1010] text-[#e24b4a] border border-[#3a1515]',
    dot: 'bg-[#e24b4a]',
    border: 'border-l-[#a32d2d]',
  },
  high: {
    badge: 'bg-[#1e1508] text-[#ef9f27] border border-[#3a2a0a]',
    dot: 'bg-[#ef9f27]',
    border: 'border-l-[#854f0b]',
  },
  medium: {
    badge: 'bg-[#0b1b2b] text-[#378add] border border-[#0d2a40]',
    dot: 'bg-[#378add]',
    border: 'border-l-[#185fa5]',
  },
  pass: {
    badge: 'bg-[#121b07] text-[#639922] border border-[#1e2e0a]',
    dot: 'bg-[#639922]',
    border: 'border-l-[#3b6d11]',
  },
}
