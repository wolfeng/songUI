const FILTER_HOST_ID = 'ses-svg-filters-host';

/**
 * 幂等注入全局 SVG 物理滤镜（生宣纸张肌理 & 朱砂印章崩边 & 日晷模糊）
 * SSR 安全：仅在存在 document 时执行一次。
 */
export function ensureSongSvgFilters(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(FILTER_HOST_ID)) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('id', FILTER_HOST_ID);
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.style.pointerEvents = 'none';

  svg.innerHTML = `
    <defs>
      <filter id="ses-xuan-paper" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.042 0" in="noise" result="coloredNoise" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>

      <filter id="ses-seal-edge" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" result="turbulence" />
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.9" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="sundialShadowBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>
  `;

  document.body.appendChild(svg);
}
