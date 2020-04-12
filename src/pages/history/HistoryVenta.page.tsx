import moment from 'moment'
import 'moment/locale/es'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import MenuLista from '../../components/GenericList/GenericList.component'
import SubheaderLista from '../../components/GenericList/SubList.component'
import { Typography } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import BackArrow from '@material-ui/icons/ArrowBack'
import AppBarComponent from '../../components/AppBar/AppBar'

interface IVenta {
  _id: string,
  items: [{ _id: string }],
  dateTime: Date | string,
  cliente?: string | 'Cliente desconocido'
}

interface ISubheader {
  title: string | null,
  items: IElement[] | null,
  id: number
}

interface IElement {
  title: string,
  subTitle: string,
  iconId?: number,
  id: string,
}

const host = "192.168.0.23"
const port = "4000"

const useStyles = makeStyles((a: Theme) => createStyles({
  root: {
    flexGrow: 1, width: '100%', '& > * + *': { marginTop: a.spacing(2), }
  }
}))

const Home: React.FC = (props: any) => {
  const classes = useStyles()
  const history = useHistory()
  const [estado, setEstado] = React.useState({ loading: true })
  const [ventas, setVentas] = React.useState<IVenta[]>()
  const [filterVentas, setFilterVentas] = React.useState<ISubheader[]>()

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('fetching')
        const response = await axios.get(`http://${host}:${port}/api/sales`)

        const json = await response.data.map((item: any): IVenta => ({
          _id: item._id || item.id,
          items: item.items.map((e: any) => e._id),
          dateTime: item.dateTime,
          cliente: item.cliente || 'Cliente desconocido'
        }))

        const subheaders: ISubheader[] = []
        if (json.length) {
          json.forEach((sale: IVenta) => {
            const month = moment.utc(sale.dateTime).get('month')
            const month_name = moment.utc(sale.dateTime).format('MMMM')
            const dateTime = moment(sale.dateTime).format('dddd D, HH:mm (Z)')
            const elem: IElement = {
              title: `${sale.cliente} · ${sale.items?.length} producto${sale.items?.length > 1 ? 's' : ''}`,
              subTitle: dateTime,
              iconId: 2,
              id: sale._id
            }
            if (!subheaders[month]) {
              subheaders[month] = { title: month_name, items: [], id: month }
            }
            subheaders[month]?.items?.push(elem)
          })
        }


        const response_data: IElement[] = json.map((item: IVenta): IElement =>
          ({
            title: `${item.cliente} · ${item.items?.length} producto${item.items?.length > 1 ? 's' : ''}`,
            subTitle: `${item.dateTime}`,
            iconId: 2,
            id: item._id
          })
        )
        // console.log(response_data)
        setVentas(json)
        setFilterVentas(subheaders)
        setEstado({ loading: false })
      } catch (error) {
        console.log("error", error)
        setEstado({ loading: false })
      }
    }
    fetchProductos()
  }, [])

  const handleItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string | number) => {
    console.log(index)
  }


  return (
    <IonPage>
      <IonHeader>
        <AppBarComponent title='Historial de ventas' goBack={true} />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Historial de ventas</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Typography variant="button" component="p" style={{ paddingLeft: 10, paddingTop: 10 }}>
        </Typography>
        {filterVentas?.length &&
          <SubheaderLista items={filterVentas} onItemClick={handleItemClick} button={true} />
        }
      </IonContent>
    </IonPage>
  )
}

export default Home
