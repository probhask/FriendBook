const RightBar = () => {
  return (
    <aside
      aria-label="Secondary"
      className="flex-1 lg:flex-[0.8] hidden xl:block bg-white sticky top-[var(--nav-h)] px-3 py-4 h-below-nav overflow-y-auto text-slate-600"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Suggestions
      </h2>
      <p className="mt-2 text-sm">
        People you may know and trending topics will appear here.
      </p>
    </aside>
  );
};

export default RightBar;
