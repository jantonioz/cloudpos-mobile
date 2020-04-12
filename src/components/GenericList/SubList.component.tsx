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
import { ListSubheader } from '@material-ui/core'

interface ISubheader {
  title: string | null,
  items: IElement[] | null,
  id: number
}

interface IElement {
  title: string,
  subTitle: string,
  iconId?: number,
  id: string
}

interface IProps {
  items: ISubheader[] | null,
  onItemClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string | number): void,
  button: boolean
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  backInherit: {
    backgroundColor: 'inherit'
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

  props?.items?.sort((a, b) => b.id - a.id)

  return (<div className={classes.root}>
    <List component="nav" style={{ backgroundColor: '#fff' }} subheader={<li />}>
      {!(props && props.items && props.items.length) ? <></> :
        props.items.map((header, idx) => (
          <li key={`section-${idx}`} className={classes.backInherit}>
            <ul className={classes.backInherit}>
              <ListSubheader>{header.title}</ListSubheader>
              {!header.items ? <></> : header.items.map(item => (
                <ListItem key={`ìtem-${item.title}-${item.id}`}>
                  <ListItemText primary={item.title} secondary={item.subTitle} />
                </ListItem>
              ))}
            </ul>
          </li>
        ))
      }
    </List>
  </div >)
}

