import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined'
import PurchaseCarIcon from '@material-ui/icons/AirportShuttleOutlined'
import InventoryIcon from '@material-ui/icons/AssignmentOutlined'
import Chart1Icon from '@material-ui/icons/Timeline'
import HistoryIcon from '@material-ui/icons/History'

import {
  Link, useHistory, useLocation
} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

export default function SelectedListItem(props: any) {
  const classes = useStyles()
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const history = useHistory()

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    console.log('selected is ', index)
    // props.history.push('/venta')
    setSelectedIndex(index)
  }

  return (
    <div className={classes.root}>
      <List component="nav" style={{ backgroundColor: '#fff' }}>

        <ListItem
          button
          // selected={selectedIndex === 0}
          onClick={event => history.push('/ventas')}
        >
          <ListItemAvatar >
            <Avatar style={{ backgroundColor: 'lightgrey' }}>
              <ShoppingCartIcon style={{ color: '#000' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Registrar venta" secondary="Agregue su ultima venta realizada" />
        </ListItem>

        <Divider />

        <ListItem
          button
          // selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemAvatar >
            <Avatar style={{ backgroundColor: 'lightgrey' }}>
              <PurchaseCarIcon style={{ color: '#000' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Compra" secondary="Agrege compras que le realizó a proveedores" />
        </ListItem>

        <Divider />

        <ListItem
          button
          // selected={selectedIndex === 1}
          onClick={event => history.push('/inventory')}
        >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: 'lightgrey' }}>
              <InventoryIcon style={{ color: '#000' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Inventario" secondary="Monitoree el inventario" />
        </ListItem>

        <Divider />

        <ListItem
          button
          // selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 3)}
        >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: 'lightgrey' }}>
              <Chart1Icon style={{ color: '#000' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Rendimiento" secondary="Reporte de rendimiento" />
        </ListItem>

        <Divider />

        <ListItem
          button
          // selected={selectedIndex === 1}
          onClick={event => history.push('/historiales/ventas')}
        >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: 'lightgrey' }}>
              <HistoryIcon style={{ color: '#000' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Historico - Ventas" secondary="Historial de ventas" />
        </ListItem>
      </List>
    </div>
  )
}
