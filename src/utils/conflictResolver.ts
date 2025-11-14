// Very simple resolver: pick the item with later updatedAt
export function resolveConflict(local: any[], remote: any[]) {
  const map = new Map<number, any>();
  local.forEach(item => map.set(item.id, item));
  remote.forEach(r => {
    const l = map.get(r.id);
    if (!l) map.set(r.id, r);
    else {
      const la = new Date(l.updatedAt).getTime();
      const ra = new Date(r.updatedAt).getTime();
      map.set(r.id, la >= ra ? l : r);
    }
  });
  return Array.from(map.values()).sort((a,b) => (b.updatedAt > a.updatedAt ? 1 : -1));
}
