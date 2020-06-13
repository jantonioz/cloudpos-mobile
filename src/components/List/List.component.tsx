import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'

import IconButton from '@material-ui/core/IconButton'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
// import PurchaseCarIcon from '@material-ui/icons/AirportShuttleOutlined'
// import InventoryIcon from '@material-ui/icons/AssignmentOutlined'
// import Chart1Icon from '@material-ui/icons/Timeline'

import {
  useHistory,
} from 'react-router-dom'

interface IProducto {
  nombre: string,
  _id: string,
  cantidad: string,
  detalle: string,
  precio: string,
  categoria: string,
  cant?: string,
  usuarioId: string,
  iconId: string,
  productoId?: string
}

interface IProps {
  items: IProducto[] | null,
  emptyText: string,
  onEdit?: (producto: IProducto) => void,
  onDelete?: (producto: IProducto) => void,
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

export default function SelectedListItem(props: IProps | null | undefined) {
  const classes = useStyles()
  const history = useHistory()

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    console.log('selected is ', index)
    // props.history.push('/venta')
  }

  return (<div className={classes.root}>
    <List component="nav" style={{ backgroundColor: '#fff' }}>
      {!(props && props.items && props.items.length) ?
        <ListItem
          key='xd'
        >
          <ListItemText primary={props?.emptyText} />
        </ListItem>
        : (
          props.items.map((item: IProducto) =>
            <ListItem
              key={item.nombre + new Date()}
            >
              <ListItemAvatar >
                <Avatar style={{ backgroundColor: 'lightgrey' }}>
                  <ShoppingCartIcon style={{ color: '#000' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${item.nombre} · ${item.cant}`} secondary={item.detalle} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={(e: any) => props.onEdit && props.onEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={(e: any) => props.onDelete && props.onDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        )}
    </List>
  </div>)
}

