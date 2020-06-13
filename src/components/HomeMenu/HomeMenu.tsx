import React from 'react'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Grid, Paper, Avatar, Box, Typography, ButtonBase, Link } from '@material-ui/core'


import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined'
import PurchaseCarIcon from '@material-ui/icons/AirportShuttleOutlined'
import InventoryIcon from '@material-ui/icons/AssignmentOutlined'
import Chart1Icon from '@material-ui/icons/Timeline'
import HistoryIcon from '@material-ui/icons/History'

import { chunk } from 'lodash'


import { useHistory, Link as RouterLink } from 'react-router-dom'
import classes from '*.module.css'

const iconProps = { style: { color: '#1464c0', fontSize: 40 }, }
const menuItems = [
  {
    id: 0,
    title: "Ventas",
    description: "",
    link: "/ventas",
    icon: (<ShoppingCartIcon style={iconProps.style} />)
  },
  {
    id: 1,
    title: "Compras",
    description: "",
    link: "/compras",
    icon: (<PurchaseCarIcon style={iconProps.style} />)
  },
  {
    id: 2,
    title: "Inventario",
    description: "",
    link: "/inventory",
    icon: (<InventoryIcon style={iconProps.style} />)
  },
  {
    id: 3,
    title: "Rendimiento",
    description: "",
    link: "/reportes",
    icon: (<Chart1Icon style={iconProps.style} />)
  },
  {
    id: 4,
    title: "Historico Ventas",
    description: "",
    link: "/historiales/ventas",
    icon: (<HistoryIcon style={iconProps.style} />)
  },
  {
    id: 5,
    title: "Historico Compras",
    description: "",
    link: "/historiales/compras",
    icon: (<HistoryIcon style={iconProps.style} />)
  },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    grid: {
      position: 'relative',
      width: '100%',
      margin: 0,
      padding: 0
      // padding: 0,
      // width: '100%',
    },
    icon: {
      // color: 'rgba(255, 255, 255, 0.54)',
    },
    paper: {
      // padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      alignContent: "center",
      alignItems: "center",
      boxAlign: "center",
      minWidth: 75,
      width: 140,
      height: 120,
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      borderRadius: 10,
      "&:hover": {
        cursor: 'pointer', 
        border: '1px solid lightgray'
      },
      "&:active": {
        backgroundColor: '#ddd',
        // transform: 'translateY(2px)'
      }
    },
    button: {
      position: 'relative',
      minWidth: 75,
      width: 140,
      height: 120,
      margin: 0,
      padding: 0
    }
  }),
)

function MenuItems(props: any) {
  const classes = useStyles()
  const chunkedItems = chunk(menuItems, 2)
  return <>
    {
      chunkedItems.map(chunk =>
        <Grid container item spacing={2} direction="row" className={classes.grid} justify="space-evenly" alignItems="baseline">
          {chunk.map(item =>
            <Grid item key={item.id}>
              {/* <Link underline="none" component={RouterLink} to={item.link}> */}
              {/* <ButtonBase className={classes.button}> */}
              <Paper elevation={8} className={classes.paper} onClick={() => props.onClick(item.link)}>
                <Box display="flex-block" width="auto" height={'auto'} style={{marginTop: 25}}>
                  <Box m="auto">
                    {item.icon}
                  </Box>
                  <Box m="auto" style={{ display: 'flex', alignItems: 'bottom', position: 'relative', bottom: 0 }}>

                  </Box>
                </Box>
                <Box display="flex" alignItems="center" height={'auto'} justifyContent="center" style={{marginTop: 15}}>
                  <Typography variant="body2" component="p" align="center" >
                    {item.title}
                  </Typography>
                </Box>
              </Paper>
              {/* </ButtonBase> */}
            </Grid>
          )}

        </Grid>
      )}
  </>
}

export default function HomeMenu() {
  const classes = useStyles()
  const history = useHistory()
  const handleClick = (linkTo: string) => {
    if (linkTo)
      history.push(linkTo)
  }

  return <div className={classes.grid}>
    <Grid container
      direction="column"
      justify="center"
      alignItems="center">
      <MenuItems onClick={handleClick} />
    </Grid>
  </div>
}