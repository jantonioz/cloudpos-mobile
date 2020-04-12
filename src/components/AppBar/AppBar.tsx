import React from 'react'

import { IonText } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import BackArrow from '@material-ui/icons/ArrowBack'
import { Typography } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((a: Theme) => createStyles({
  root: {
    flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }
  }
}))

export default function AppBarComponent(props: { title: string, goBack: boolean }) {
  const classes = useStyles()
  const history = useHistory()
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {!props.goBack ? <> </> :
            <IconButton onClick={() => { history.goBack() }}>
              <BackArrow style={{ color: '#fff' }} />
            </IconButton>}
          <IonText style={{ width: '40%' }}>
            {props.title}
          </IonText>
        </Toolbar>
      </AppBar>
    </div>
  )
}
