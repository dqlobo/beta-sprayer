import { ReactElement } from "react"

interface Props extends ReactElement {
  scale: number
  x: number
  y: number
}
const ORIGINAL_SCALE = 94
export default function FootSVG(props: Props) {
  return (
    <g transform={`scale(${ORIGINAL_SCALE / props.scale})`}>
      <circle cx="47" cy="47" r="47" fill="#84CD61" />
      <path
        d="M58.5 73.5C52.5 89.1 40 78 40 73.5C40 68.9075 46.5 61.5 42.5 52.5C38.5 43.5 26.9657 39.2755 31 33C40 21 50.7872 21.5 55 30.5C58.6666 38.3333 64.5 57.9 58.5 73.5Z"
        fill="white"
      />
      <circle cx="24" cy="30" r="3" fill="white" />
      <circle cx="30" cy="24" r="3" fill="white" />
      <circle cx="38" cy="18" r="3" fill="white" />
      <circle cx="48" cy="16" r="5" fill="white" />
    </g>
  )
}
