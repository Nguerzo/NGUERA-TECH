// Deliberately CSS-only (no Framer Motion / JS animation state machine) —
// this wrapper sits above every page's content, so it must never be able to
// leave that content non-interactive. A CSS animation always resolves to its
// final state on its own timeline; it can never get stuck waiting on a
// requestAnimationFrame callback the way a JS-driven animation library can
// (e.g. a throttled/backgrounded tab), which would otherwise risk leaving the
// entire page inert.
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
