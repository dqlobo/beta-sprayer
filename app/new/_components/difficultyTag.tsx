import { gold, green, red, volcano, yellow } from "@ant-design/colors"
import { Tag } from "antd"

interface Props {
  grade: number
}
function generateColor(grade: number) {
  if (grade < 2) return green[4]
  if (grade < 4) return yellow[5]
  if (grade < 7) return gold[5]
  if (grade < 10) return volcano[6]
  return red[8]
}
export default function DifficultyTag(props: Props) {
  return (
    <Tag color={generateColor(props.grade)} className="text-lg font-semibold">
      v{props.grade}
    </Tag>
  )
}
