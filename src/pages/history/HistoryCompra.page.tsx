import moment from 'moment'
import 'moment/locale/es'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react'
import React from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import axios from 'axios'
import SubheaderLista from '../../components/GenericList/SubList.component'
import { Grid } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppBarComponent from '../../components/AppBar/AppBar'
import { useSessionState } from '../../hooks/Session/useSessionState'

import { ICompra, ISubheader, IElement, IDateFilter } from '../types'
import { DatePicker } from '@material-ui/pickers'


const host = process.env.REACT_APP_HOST
const port = process.env.REACT_APP_PORT
const apiKey = process.env.REACT_APP_API_KEY

const useStyles = makeStyles((a: Theme) => createStyles({
  root: {
    flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }
  }
}))

const Home: React.FC = (props: any) => {
  const classes = useStyles()
  const history = useHistory()
  const [estado, setEstado] = React.useState({ loading: true })
  const [filterCompras, setFilterCompras] = React.useState<ISubheader[]>()

  const [dateFilter, setDateFilter] = React.useState<IDateFilter>({
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month')
  })
  const session = useSessionState()

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('fetching')
        const response = await axios.get(`${host}/api/purchases`,  {
          headers: {
            'API-KEY': apiKey,
            'AUTH-TOKEN': session.sessionState.token,
          },
          params: {
            startDate: dateFilter.startDate.toISOString(),
            endDate: dateFilter.endDate.toISOString()
          }
        })
        console.log(response.data)
        const json = (await response.data.map((item: any): ICompra => ({
          _id: item._id || item.id,
          items: item.items.map((e: any) => e._id),
          dateTime: item.dateTime,
          sellerName: item.sellerName
        }))).sort((a: ICompra, b: ICompra) => Number(new Date(b.dateTime)) - Number(new Date(a.dateTime)))

        const subheaders: ISubheader[] = []
        if (json.length) {
          json.forEach((purchase: ICompra) => {
            const month = moment.utc(purchase.dateTime).get('month')
            const month_name = moment.utc(purchase.dateTime).format('MMMM')
            const dateTime = moment(purchase.dateTime).format('dddd D, HH:mm (Z)')
            const elem: IElement = {
              title: `${purchase.sellerName} · ${purchase.items?.length} producto${purchase.items?.length > 1 ? 's' : ''}`,
              subTitle: dateTime,
              iconId: 2,
              id: purchase._id
            }
            if (!subheaders[month]) {
              subheaders[month] = { title: month_name, items: [], id: month }
            }
            subheaders[month]?.items?.push(elem)
          })
        }

        setFilterCompras(subheaders)
        setEstado({ loading: false })
      } catch (error) {
        console.log("error", error)
        setEstado({ loading: false })
      }
    }
    fetchProductos()
  }, [dateFilter])

  if (!session.sessionState.token.length) {
    return <Redirect to="/signin" />
  }

  const handleItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string | number) => {
    console.log(index)
  }

  const handleStartDate = (date: moment.Moment | null) => {
    if (date)
      setDateFilter({ ...dateFilter, startDate: date })
  }

  const handleEndDate = (date: moment.Moment | null) => {
    if (date)
      setDateFilter({ ...dateFilter, endDate: date })
  }

  return estado.loading ? <p>loading</p> : (
    <IonPage>
      <IonHeader>
        <AppBarComponent title='Historial de compras' goBack={true} />
      </IonHeader>
      <IonContent>

      <Grid container direction="row" spacing={1} justify="space-evenly" style={{ marginTop: 10 }}>
          <Grid item>
            <DatePicker
              value={dateFilter.startDate}
              onChange={handleStartDate}
              label="Inicio"
              format="YYYY/MM/DD"
              views={["month", "date"]}
              style={{ width: 110 }} />
          </Grid>
          <Grid item>
            <DatePicker
              value={dateFilter.endDate}
              onChange={handleEndDate}
              label="Fin"
              format="YYYY/MM/DD"
              views={["month", "date"]}
              style={{ width: 110 }} />
          </Grid>
        </Grid>
        {!filterCompras?.length ? <p></p> : (
          <SubheaderLista
            items={filterCompras}
            onItemClick={handleItemClick}
            button={true}
          />
        )}
      </IonContent>
    </IonPage>
  )
}

export default Home
