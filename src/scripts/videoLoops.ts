// Ambient trust-video loops (video[data-src]): lazy-load + play only while in
// view; poster-only for reduced-motion / data-saver (same policy as the hero
// videos — CLAUDE.md animation contract). Idempotent via data-loopInit.
export function initVideoLoops(scope: ParentNode = document): void {
  const vids = Array.from(scope.querySelectorAll<HTMLVideoElement>('video[data-src]'));
  if (!vids.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  for (const v of vids) {
    if (v.dataset.loopInit) continue;
    v.dataset.loopInit = '1';
    if (reduce || save) continue; // poster stays — fully static
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!v.src) {
              v.src = v.dataset.src || '';
              v.load();
            }
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(v);
  }
}
