import { readFileSync } from 'node:fs'
import { type ImageResponse } from 'next/og'
import { packages } from '@/utils/metadata'
import { metadataImage } from '@/utils/metadata-image'
import { generateOGImage } from './og'

const font = readFileSync('./app/og/[...slug]/Geist-Regular.ttf')
const fontBold = readFileSync('./app/og/[...slug]/Geist-Bold.ttf')

export const GET = metadataImage.createAPI((page): ImageResponse => {
  const pkg = packages[page.slugs[0]]

  return generateOGImage({
    primaryTextColor: 'rgb(240,240,240)',
    primaryColor: 'rgba(65,65,84,0.9)',
    title: page.data.title,
    icon: (
      <svg fill="none" height="64" width="64" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_107_5)">
          <path
            d="M1250 -0.000109278C2258.14 -2.11437e-05 2500 241.855 2500 1250C2500 2258.14 2258.14 2500 1250 2500C241.855 2500 2.11437e-05 2258.14 0.000109278 1250C0.000197413 241.855 241.856 -0.000197413 1250 -0.000109278ZM1603.87 1881.37L1995.93 990.322C2013.75 947.041 2029.02 891.045 2029.02 842.666C2029.02 621.182 1873.73 465.879 1652.25 465.879C1579.66 465.879 1519.38 484.951 1458.11 504.336L1458.06 504.365C1394.69 524.414 1330.23 544.805 1250 544.805C1168.83 544.805 1105.92 524.59 1043.77 504.629L1043.75 504.619C983.106 485.137 923.194 465.879 847.764 465.879C626.279 465.879 470.977 621.181 470.977 842.666C470.977 891.045 486.26 947.041 504.072 990.322L896.123 1881.37C962.334 2031.56 1089.61 2113.04 1250 2113.04C1410.39 2113.04 1537.68 2031.57 1603.87 1881.37ZM1636.97 850.303L1250 1726.06L868.125 850.303C977.598 903.76 1115.07 929.219 1250 929.219C1390.02 929.219 1522.41 903.76 1636.97 850.303Z"
            fill="#E74343"
          />
          <rect fill="#E74343" height="2015" width="1864" x="359" y="210" />
          <path
            d="M915.682 584.42C839.587 584.326 765.025 605.827 700.659 646.428C636.292 687.028 584.762 745.061 552.052 813.786C519.342 882.511 506.796 959.109 515.87 1034.68C524.944 1110.25 555.267 1181.7 603.315 1240.73L1248.32 1998L1886.96 1248.28L1890.14 1244.7L1893.32 1240.73C1928.2 1198.65 1954.15 1149.91 1969.59 1097.48C1985.03 1045.05 1989.64 990.02 1983.14 935.749C1976.63 881.478 1959.15 829.1 1931.75 781.806C1904.36 734.512 1867.62 693.291 1823.79 660.656C1779.95 628.02 1729.93 604.653 1676.78 591.977C1623.62 579.302 1568.45 577.583 1514.6 586.927C1460.76 596.27 1409.39 616.48 1363.61 646.324C1317.83 676.169 1278.6 715.023 1248.32 760.521C1211.52 706.266 1162 661.849 1104.09 631.151C1046.17 600.454 981.624 584.409 916.08 584.42H915.682Z"
            stroke="#1E1E1E"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="363"
          />
        </g>
        <defs>
          <clipPath id="clip0_107_5">
            <rect
              fill="white"
              height="2500"
              transform="translate(2500 2500) rotate(-180)"
              width="2500"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    description: page.data.description,
    site: 'FriendsOfAdonis',
    fonts: [
      {
        name: 'Geist',
        data: font,
        weight: 400,
      },
      {
        name: 'Geist',
        data: fontBold,
        weight: 600,
      },
    ],
    ...(pkg
      ? {
          site: pkg.package,
          title: pkg.name,
          description: pkg.description,
        }
      : {}),
  })
})

export function generateStaticParams(): {
  slug: string[]
}[] {
  return metadataImage.generateParams()
}
