import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'

import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined'
// import PurchaseCarIcon from '@material-ui/icons/AirportShuttleOutlined'
import InventoryIcon from '@material-ui/icons/AssignmentOutlined'
// import Chart1Icon from '@material-ui/icons/Timeline'

import {
  useHistory,
} from 'react-router-dom'

interface IElement {
  title: string,
  subTitle: string,
  iconId?: number,
  id: string
}

interface IProps {
  items: IElement[] | null,
  onItemClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string | number): void,
  button: boolean
}


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

function RenderIcon(props: { item: IElement }) {
  const { item } = props
  if (!item || !item.iconId) return <></>
  switch (item.iconId) {
    case 1:
      return <ShoppingCartIcon style={{ color: '#000' }} />
    case 2:
      return <InventoryIcon style={{ color: '#000' }} />
  }
  return <> </>
}

export default function SelectedListItem(props: IProps | null | undefined) {
  const classes = useStyles()
  const history = useHistory()


    return (<div className={classes.root}>
      <List component="nav" style={{ backgroundColor: '#fff' }}>
        {!(props && props.items && props.items.length) ?
          <></>
          : (
            props.items.map((item: IElement) =>
              <ListItem
                key={item.id}
                onClick={event => props.onItemClick(event, item.id)}
                button
              >
                <ListItemAvatar >
                  <Avatar style={{ backgroundColor: 'lightgrey' }}>
                    <RenderIcon item={item} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.title} secondary={item.subTitle} />
              </ListItem>
            )
          )}
      </List>
    </div >)
}

