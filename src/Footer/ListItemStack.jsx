import { Stack, ListItem } from '@mui/material'
import { Children, cloneElement } from 'react'

function ListItemStack({ children, ...rest }) {
  const modifiedChildren = Children.map(children, (child) => {
    // children: The value of the children prop received by your component.
    if (child.type === ListItem) {
      return cloneElement(child, {
        disablePadding: true,
        ...child.props,
      })
    }
    return child
  })

  return (
    <Stack padding={0} component="ul" {...rest}>
      {modifiedChildren}
    </Stack>
  )
}

export default ListItemStack
