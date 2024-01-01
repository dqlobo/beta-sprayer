import { Button, ButtonProps, Spinner } from "flowbite-react"
interface Props extends ButtonProps {
  loading?: boolean
}
export function LoadableButton(props: Props) {
  const { loading, ...buttonProps } = props
  return (
    <Button {...buttonProps} disabled={props.loading}>
      {loading ? <Spinner /> : props.children}
    </Button>
  )
}
