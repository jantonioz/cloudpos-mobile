import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react'
import React from 'react'
import MenuLista from '../../components/MenuLista/MenuLista.component'
import HomeMenu from '../../components/HomeMenu/HomeMenu'

import { useHistory, Redirect } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import BackArrow from '@material-ui/icons/ArrowBack'
import { Typography } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AppBarComponent from '../../components/AppBar/AppBar'

// Hooks
import { useSessionState } from '../../hooks/Session/useSessionState'

const useStyles = makeStyles((a: Theme) => createStyles({
  root: {
    flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }
  },
  toolbarBg: {
    position: 'absolute',
    top: -128,
    bottom: 0,
    right: 0,
    left: 0,
    // zIndex: , 
    width: '100%',
    height: 206,
    backgroundImage: 'linear-gradient(180deg, rgba(5,117,230,1) 0%, rgba(2,27,121,1) 99%)',
    transform: 'skewY(-6deg)',
    transformOrigin: 'top left',
    zIndex: 0
  },
}))

const Home: React.FC = (props) => {
  const classes = useStyles()
  const history = useHistory()
  const session = useSessionState()

  if (!session.sessionState.token.length) {
    return <Redirect to="/signin" />
  }

  const handleLogout = (e: any) => {
    session.setSessionState({ type: 'resetToken' })
    if (localStorage.getItem('token'))
      localStorage.removeItem('token')
    if (localStorage.getItem('tokenExp'))
      localStorage.removeItem('tokenExp')
    history.push('/')
  }

  return (
    <IonPage>
      <IonHeader >
        <AppBarComponent title='Menu Principal' goBack={false} button={{ title: 'Cerrar Sesion', handleClick: handleLogout }} expanded />
      </IonHeader>
      <IonContent style={{ zIndex: 999 }}>
        <div >
          <div className={classes.toolbarBg}>
          </div>
          <Typography variant="button" component="p" style={{ paddingLeft: 10, paddingTop: 10 }}>
          </Typography>
          <HomeMenu />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home
