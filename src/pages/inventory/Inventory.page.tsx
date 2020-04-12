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
  productoId?: string,
  peso: number
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
  const [productos, setProductos] = React.useState<ISubheader[] | null>()
  // const [productos, setProductos] = React.useState<IProducto[] | null>()
  const [isLoading, setLoading] = React.useState(true)
  const [filterVentas, setFilterVentas] = React.useState<ISubheader[]>()

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('fetching')
        const response = await axios.get(`http://${host}:${port}/api/productos`)
        const json = await response.data
        console.log(json)

        const list: ISubheader[] = []
        let categorias: string[] = []

        json.forEach((item: IProducto) => {
          if (!categorias.length) categorias.push(item.categoria)
          else categorias = [...Array.from((new Set(categorias)).values()), item.categoria]
          const idx = categorias.findIndex((e: string) => e === item.categoria)

          const elem: IElement = {
            id: item._id,
            title: `${item.nombre} · ${item.cantidad} disponibles`,
            subTitle: `${item.peso}g · $${item.precio}`
          }

          if (!list[idx]) {
            list[idx] = { title: item.categoria, items: [], id: idx }
          }
          list[idx]?.items?.push(elem)
        })

        setProductos(list)
        setLoading(false)
      } catch (error) {
        console.log("error", error)
        setLoading(false)
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
        <AppBarComponent title='Inventario' goBack={true} />
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inventario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Typography variant="button" component="p" style={{ paddingLeft: 10, paddingTop: 10 }}>
        </Typography>
        {productos?.length &&
          <SubheaderLista items={productos} onItemClick={handleItemClick} button={true} />
        }
      </IonContent>
    </IonPage>
  )
}

export default Home
