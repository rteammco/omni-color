export function AppFooter() {
  return (
    <div className="w-full flex flex-row justify-center pt-8 pb-4 gap-12 border-t border-neutral-200">
      <div className="flex flex-col gap-1">
        <span className="mb-1 font-semibold text-neutral-500">omni-color</span>
        <a href="https://github.com/rteammco/omni-color/blob/main/README.md">API documentation</a>
        <a href="https://github.com/rteammco/omni-color">Source code</a>
        <a href="https://github.com/rteammco/omni-color/blob/main/LICENSE">ISC license</a>
      </div>
      <div className="flex flex-col gap-1">
        <span className="mb-1 font-semibold text-neutral-500">Accessibility</span>
        <a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a>
        <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">
          Understanding contrast
        </a>
        <a href="https://github.com/Myndex/apca-w3">APCA W3C</a>
        <a href="https://git.apcacontrast.com/documentation/">APCA documentation</a>
      </div>
    </div>
  );
}
