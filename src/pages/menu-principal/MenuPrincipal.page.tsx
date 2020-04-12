import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react'
import React from 'react'
import MenuLista from '../../components/MenuLista/MenuLista.component'

import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import BackArrow from '@material-ui/icons/ArrowBack'
import { Typography } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AppBarComponent from '../../components/AppBar/AppBar'

const useStyles = makeStyles((a: Theme) => createStyles({
  root: {
    flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }
  }
}))

const Home: React.FC = (props) => {
  const classes = useStyles()
  const history = useHistory()
  return (
    <IonPage>
      <IonHeader>
        <AppBarComponent title='Menu Principal' goBack={false} />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Menu Principal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Typography variant="button" component="p" style={{ paddingLeft: 10, paddingTop: 10 }}>
          Acciones rápidas
        </Typography>
        <MenuLista />
      </IonContent>
    </IonPage>
  )
}

export default Home
