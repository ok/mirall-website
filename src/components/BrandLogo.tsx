import { useTranslation } from 'react-i18next'

interface BrandLogoProps {
  className?: string
  /** The white wordmark, for dark backgrounds. */
  inverse?: boolean
}

/**
 * The wordmark, inline rather than an <img> of public/logo.svg (whose paths these are).
 * The letters are filled with the text colour, so anything that recolours the page's
 * text recolours them too. Dark Reader and browsers' forced dark modes darken the
 * header but leave an image as it is, which left a black wordmark on a black header.
 */
export default function BrandLogo({ className = 'h-7', inverse = false }: BrandLogoProps) {
  const { t } = useTranslation()
  // No width/height on the SVG: the viewBox supplies the aspect ratio and callers
  // size the mark by height alone.
  return (
    <svg
      viewBox="0 0 2835 844"
      role="img"
      aria-label={t('brand')}
      fill="currentColor"
      className={`block w-auto ${inverse ? 'text-white' : 'text-black'} ${className}`}
    >
      <g transform="matrix(4.166667,0,0,4.166667,-356.081667,-1351.366667)">
        <path transform="translate(251.3906,523.7084)" d="M0,-196.22L-62.292,-111.171L-126.424,-196.22L-165.931,-196.22L-165.931,0L-125.107,0L-125.107,-129.2L-65.846,-50.043L-60.578,-50.043L-1.317,-126.442L-1.317,0L39.507,0L39.507,-196.22L0,-196.22Z" />
        <rect x="314.601" y="327.488" width="39.507" height="39.507" />
        <rect x="314.601" y="379.901" width="39.507" height="143.807" />
        <path transform="translate(528.4458,424.5448)" d="M0,57.681C-2.725,62.512 -6.543,66.331 -11.457,69.138C-16.375,71.949 -22.083,73.352 -28.577,73.352C-33.495,73.352 -37.623,72.126 -40.956,69.665C-44.294,67.208 -45.96,63.784 -45.96,59.393C-45.96,54.652 -44.471,51.01 -41.483,48.463C-38.499,45.919 -34.199,44.117 -28.577,43.063L4.082,37.231L4.082,41.746C4.082,47.541 2.72,52.854 0,57.681M35.952,-18.305C30.857,-26.733 23.573,-33.227 14.091,-37.795C4.609,-42.359 -6.716,-44.643 -19.885,-44.643L-149.265,-44.643L-149.265,99.164L-109.758,99.164L-109.758,-10.404L-22.519,-10.404C-13.918,-10.404 -7.334,-8.206 -2.766,-3.819C0.584,-0.596 2.694,3.438 3.586,8.268L-35.689,14.618C-47.104,16.375 -56.627,19.359 -64.266,23.573C-71.904,27.787 -77.566,33.014 -81.254,39.244C-84.941,45.479 -86.785,52.636 -86.785,60.71C-86.785,69.315 -84.768,76.735 -80.727,82.966C-76.69,89.2 -70.895,93.987 -63.344,97.32C-55.796,100.653 -46.841,102.324 -36.479,102.324C-28.754,102.324 -21.729,101.312 -15.408,99.295C-9.087,97.279 -3.383,94.205 1.712,90.077C3.431,88.684 5.096,87.155 6.716,85.511L6.716,99.164L43.59,99.164L43.59,11.721C43.59,0.132 41.042,-9.877 35.952,-18.305" />
        <rect x="598.477" y="324.328" width="39.507" height="199.381" />
        <rect x="663.056" y="324.328" width="39.507" height="199.381" />
        <rect x="726.267" y="484.073" width="39.507" height="39.507" fill="#fb9c43" />
      </g>
    </svg>
  )
}
