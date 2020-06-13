import moment from 'moment'
import {
  IonContent,
  IonHeader,
  IonPage,
} from '@ionic/react'
import React from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import { useHistory, Redirect } from 'react-router-dom'
import AppBarComponent from '../../components/AppBar/AppBar'

// chart js
import { Line, Bar, Bubble } from 'react-chartjs-2'

// Circular progress
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css"

// Types
import { IPerformanceChartData, TabPanelProps, IDateFilter, IVenta, ICompra } from '../types'

// Hooks
import { useSessionState } from '../../hooks/Session/useSessionState'
import { Paper, Tabs, Tab, Box, CircularProgress } from '@material-ui/core'

// eslint-disable-line
const useStyles = makeStyles((a: Theme) =>
  createStyles({
    listbox: { '& ul': { padding: 0, margin: 0 } },
    root: {
      flexGrow: 1,
      width: '100%',
      '& > * + *': { marginTop: a.spacing(2) },
    },
    menuButton: { marginRight: a.spacing(2) },
    title: {
      flexGrow: 1,
      display: 'none',
      [a.breakpoints.up('sm')]: { display: 'block' },
      color: '#fff',
    },
    performanceContent: {
      margin: a.spacing(2)
    }
  })
)

const host = process.env.REACT_APP_HOST
const port = process.env.REACT_APP_PORT
const apiKey = process.env.REACT_APP_API_KEY

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

function a11yProps(index: any) {
  return {
    id: `performance-tab-${index}`,
    'aria-controls': `performance-tabpanel-${index}`,
  }
}

function LoadPerformance(props: { date: 'day' | 'month' | 'year' }) {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(true)
  const session = useSessionState()
  const [dateFilter, setDateFilter] = React.useState<IDateFilter>({
    startDate: moment().startOf(props.date),
    endDate: moment().endOf(props.date),
  })
  const [chartData, setChartData] = React.useState<IPerformanceChartData>({})
  const [currentTotal, setCurrentTotal] = React.useState(0)
  const dailyTotalTarget = 700
  const totalTargetesByDate = {
    day: dailyTotalTarget,
    month: Number((dailyTotalTarget * 30 * 0.7).toFixed(1)),
    year: Number((dailyTotalTarget * 250 * 0.5).toFixed(1))
  }

  const filterBy = props.date === 'day' ? 'hour' : props.date === 'month' ? 'week' : 'month'

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('fetching')
        const ventasPromise = axios.get(`${host}/api/sales`, {
          headers: {
            'API-KEY': apiKey,
            'AUTH-TOKEN': session.sessionState.token,
          },
          params: {
            startDate: dateFilter.startDate.toISOString(),
            endDate: dateFilter.endDate.toISOString(),
          },
        })

        const comprasPromise = axios.get(`${host}/api/purchases`, {
          headers: {
            'API-KEY': apiKey,
            'AUTH-TOKEN': session.sessionState.token,
          },
          params: {
            startDate: dateFilter.startDate.toISOString(),
            endDate: dateFilter.endDate.toISOString(),
          },
        })

        const [ventasResponse, comprasResponse] = await Promise.all([ventasPromise, comprasPromise])

        console.log(ventasResponse, comprasResponse)

        let labels = ['']
        if (props.date === 'day') {
          labels = new Array(24).fill(0).map((e, hour) => moment({ hour }).format('H:mm A'))
        }
        if (props.date === 'month') {
          labels = ['S1', 'S2', 'S3', 'S4']
        }
        if (props.date === 'year') {
          labels = moment.monthsShort()
        }
        const startSplit = moment().startOf(props.date).get(filterBy)
        const perSplitSum: number[] = labels.map(e => 0)
        const perSplitPurchase: number[] = labels.map(e => 0)

        const dataChart: IPerformanceChartData = {
          salesData: {
            labels: labels,
            datasets: [{
              label: 'Ventas',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgb(5, 115, 228, 0.4)',
              borderColor: 'rgb(5, 115, 228, 1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgb(5, 115, 228, 1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgb(5, 115, 228, 1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: []
            }, {
              label: 'Compras',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgb(230, 81, 0, 0.4)',
              borderColor: 'rgb(230, 81, 0, 1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgb(230, 81, 0, 1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgb(230, 81, 0, 1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: []
            }]
          }
        }

        ventasResponse.data.forEach(
          (item: any): IVenta => item.items.forEach((e: any) => {
            const splitNumber = moment(item.dateTime).get(filterBy)
            perSplitSum[splitNumber - startSplit] += e.sku?.precio * e.cantidad
          })
        )


        comprasResponse.data.forEach(
          (item: any): ICompra => item.items.forEach((e: any) => {
            const splitNumber = moment(item.dateTime).get(filterBy)
            perSplitPurchase[splitNumber - startSplit] += e.sku?.precio * e.cantidad
          })
        )


        if (dataChart.salesData?.datasets && dataChart.salesData?.datasets[0].data)
          dataChart.salesData.datasets[0].data = perSplitSum
        if (dataChart.salesData?.datasets && dataChart.salesData?.datasets[1].data)
          dataChart.salesData.datasets[1].data = perSplitPurchase

        setChartData(dataChart)
        setLoading(false)
        if (currentTotal !== perSplitSum.reduce((a, e) => a + e)) {
          console.log('totals are different', currentTotal, perSplitSum.reduce((a, e) => a + e))
          setCurrentTotal(perSplitSum.reduce((a, e) => a + e))
        }
      } catch (error) {
        console.log('error', error)
        setLoading(false)
      }
    }
    fetchProductos()
  }, [])

  const currentPercent = Number(((currentTotal * 100) / totalTargetesByDate[props.date]).toFixed(1))
  const colorByPercent = (percent: number): string => {
    const colors = ['rgb(255, 64, 0)', 'rgb(255, 128, 0)', 'rgb(255, 191, 0)', 'rgb(255, 255, 0)',
      'rgb(191, 255, 0)', 'rgb(128, 255, 0)', 'rgb(64, 255, 0)', 'rgb(0, 255, 0)']
    const colorIdx = Number((percent * colors.length / 100).toFixed(0))
    if (colorIdx < colors.length)
      return colors[colorIdx]
    return 'rgb(0, 0, 255)'
  }

  return loading ? <Box display="flex" style={{ alignItems: 'center' }}>
    <Box m="auto">
      <CircularProgress size={40} thickness={4} style={{ color: 'rgba(63,81,181,1)', marginTop: 50 }} />
    </Box>
  </Box> :
    <Box className={classes.performanceContent}>
      <Box display="flex" alignContent="center" style={{ margin: 10 }}>
        <Box m="auto">
          <Typography variant="h5"></Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" style={{ marginBottom: 20 }}>
        <Box m="auto" style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            value={currentPercent}
            text={`${currentPercent}%`}
            styles={buildStyles({
              textColor: "black",
              pathColor: colorByPercent(currentPercent),
              trailColor: "lightgrey"
            })}
            strokeWidth={10}
          />

        </Box>
      </Box>
      <Box display="flex" alignContent="center" style={{ marginTop: 5, marginBottom: 5 }}>
        <Box m="auto" style={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="body2" >${currentTotal} / ${totalTargetesByDate[props.date]}</Typography>
        </Box>
      </Box>
      <Box display="flex" alignContent="center" >
        <Box m="auto">
          <Typography variant="h6" style={{ marginTop: 25 }}>Gráfico</Typography>
        </Box>
      </Box>
      <Box>
        {/* {props.date === 'day' ? */}
        <Line data={chartData.salesData} /> {/* : */}
        {/* <Bar data={chartData.salesData} />} */}
      </Box>
    </Box>
}

const Performance: React.FC = (props) => {
  const classes = useStyles()
  const history = useHistory()

  const session = useSessionState()
  const [isLoading, setLoading] = React.useState(true)

  const [selectedTab, setSelectedTab] = React.useState<number>(0)

  React.useEffect(() => {
    const reloadTabs = () => {
      // console.log('reaload tabs', selectedTab, 0)
      setSelectedTab(0)
      setLoading(false)
    }
    reloadTabs()
  }, [])

  if (!session.sessionState.token.length) {
    return <Redirect to="/signin" />
  }

  const handleTabChange = (e: any, val: number) => {
    // console.log(val)
    setSelectedTab(val)
  }

  return isLoading ? (
    <p>loading</p>
  ) : (
      <IonPage>
        <IonHeader>
          <AppBarComponent
            goBack={true}
            title="Rendimiento"
            key="rendimiento-key"
          />
        </IonHeader>
        <IonContent>
          <Paper square>
            <Tabs
              value={selectedTab}
              indicatorColor="primary"
              onChange={handleTabChange}
              centered
            >
              <Tab defaultChecked={true} label="Hoy" />
              <Tab label="30 días" />
              <Tab label="Año" />
            </Tabs>
          </Paper>
          <TabPanel value={selectedTab} index={0}>
            <LoadPerformance date="day" />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <LoadPerformance date="month" />
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <LoadPerformance date="year" />
          </TabPanel>
        </IonContent>
      </IonPage>
    )
}

export default Performance
