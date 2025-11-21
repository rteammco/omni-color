interface Props {
  pageDescription?: string;
}

export function AppHeader({ pageDescription }: Props) {
  return (
    <div>
      <h1 className="mb-6">omni-color</h1>
      {pageDescription ? (
        <h3>{pageDescription}</h3>
      ) : (
        <>
          <h3 className="mb-4">A fast, powerful, and lightweight color library for TypeScript</h3>
          <h6 className="font-mono">
            conversions &middot; manipulations &middot; combinations &middot; harmonies &middot;
            color palettes &middot; accessibility
          </h6>
        </>
      )}
    </div>
  );
}
