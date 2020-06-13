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
    // backgroundColor: theme.palette.background.paper
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
  // background-color: #8EC5FC;
  // background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);


  return (
    <div className={classes.root}>
      <List component="nav" >

        <ListItem
          button
          // selected={selectedIndex === 0}
          onClick={event => history.push('/ventas')}
        >
          <ListItemAvatar >
            <Avatar style={{ backgroundColor: '#00000000' }}>
              <ShoppingCartIcon style={{ color: '#1565c0' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Registrar venta" secondary="Agregue su ultima venta realizada" />
        </ListItem>

        <Divider />

        <ListItem
          button
          // selected={selectedIndex === 1}
          onClick={event => history.push('/compras')}
        >
          <ListItemAvatar >
            <Avatar style={{ backgroundColor: '#00000000' }}>
              <PurchaseCarIcon style={{ color: '#1565c0' }} />
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
            <Avatar style={{ backgroundColor: '#00000000' }}>
              <InventoryIcon style={{ color: '#1565c0' }} />
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
            <Avatar style={{ backgroundColor: '#00000000' }}>
              <Chart1Icon style={{ color: '#1565c0' }} />
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
            <Avatar style={{ background: '#00000000' }}>
              <HistoryIcon style={{ color: '#1565c0' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Historico - Ventas" secondary="Historial de ventas" />
        </ListItem>

        <Divider />

        <ListItem
          button
          // selected={selectedIndex === 1}
          onClick={event => history.push('/historiales/compras')}

        >
          <ListItemAvatar>
            <Avatar style={{ background: '#00000000' }}>
              <HistoryIcon style={{ color: '#1565c0' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Historico - Compras" secondary="Historial de compras" />
        </ListItem>
      </List>
    </div>
  )
}
