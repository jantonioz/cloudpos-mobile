import moment from 'moment'
// import 'moment/locale/es'
import {
  IonContent,
  IonHeader,
  IonPage
} from '@ionic/react'
import React from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import axios from 'axios'
import SubheaderLista from '../../components/GenericList/SubList.component'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppBarComponent from '../../components/AppBar/AppBar'
import { Grid } from '@material-ui/core'

// DatePicker
import {
  DatePicker,
  // TimePicker,
  // DateTimePicker
} from '@material-ui/pickers';

import { useSessionState } from '../../hooks/Session/useSessionState'

import { IDateFilter, IElement, IVenta, ISubheader } from '../types'

const host = process.env.REACT_APP_HOST
const apiKey = process.env.REACT_APP_API_KEY

const useStyles = makeStyles((a: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      '& > * + *': { marginTop: a.spacing(2) },
    },
  })
)

const Home: React.FC = (props: any) => {
  const [estado, setEstado] = React.useState({ loading: true })
  const [dateFilter, setDateFilter] = React.useState<IDateFilter>({
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month')
  })
  const [filterVentas, setFilterVentas] = React.useState<ISubheader[]>()
  const session = useSessionState()

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('fetching', dateFilter)
        const response = await axios.get(`${host}/api/sales`, {
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
        const json = (
          await response.data.map(
            (item: any): IVenta => ({
              _id: item._id || item.id,
              items: item.items.map((e: any) => e._id),
              dateTime: item.dateTime,
              clientName: item.clientName,
            })
          )
        ).sort(
          (a: IVenta, b: IVenta) =>
            Number(new Date(b.dateTime)) - Number(new Date(a.dateTime))
        )

        const subheaders: ISubheader[] = []
        if (json.length) {
          json.forEach((sale: IVenta) => {
            const month = moment.utc(sale.dateTime).get('month')
            const month_name = moment.utc(sale.dateTime).format('MMMM')
            const dateTime = moment(sale.dateTime).format('dddd D, HH:mm (Z)')
            const elem: IElement = {
              title: `${sale.clientName} · ${sale.items?.length} producto${
                sale.items?.length > 1 ? 's' : ''
                }`,
              subTitle: dateTime,
              iconId: 2,
              id: sale._id,
            }
            if (!subheaders[month]) {
              subheaders[month] = { title: month_name, items: [], id: month }
            }
            subheaders[month]?.items?.push(elem)
          })
        }
        setFilterVentas(subheaders)
        setEstado({ loading: false })
      } catch (error) {
        console.log('error', error)
        setEstado({ loading: false })
      }
    }
    fetchProductos()
  }, [dateFilter])

  if (!session.sessionState.token.length) {
    return <Redirect to="/signin" />
  }

  const handleItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: string | number
  ) => {
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
        <AppBarComponent title="Historial de ventas" goBack={true} />
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
        {!filterVentas?.length ? <p></p> : (
          <SubheaderLista
            items={filterVentas}
            onItemClick={handleItemClick}
            button={true}
          />
        )}
      </IonContent>
    </IonPage>
  )
}

export default Home
