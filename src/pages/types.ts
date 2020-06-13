export interface IVenta {
	_id: string
	items: [
		{
			_id: string
			sku?: {
				precio: number
				nombre: string
				categoria: string
			}
			cantidad?: number
		}
	]
	dateTime: Date | string
	clientName?: string | 'Cliente desconocido'
}

export interface ICompra {
	_id: string
	items: [{ _id: string }]
	dateTime: Date | string
	sellerName?: string | 'Cliente desconocido'
}

export interface ISubheader {
	title: string | null
	items: IElement[] | null
	id: number
}

export interface IElement {
	title: string
	subTitle: string
	iconId?: number
	id: string
}

export interface IDateFilter {
	startDate: moment.Moment
	endDate: moment.Moment
}

export interface ISnackbar {
	open?: boolean
	type: 'success' | 'warning' | 'error' | 'info'
	text?: string
}

export interface IProducto {
	nombre: string
	_id: string
	cantidad: string
	detalle: string
	precio: string
	categoria: string
	cant?: string
	usuarioId: string
	iconId: string
	productoId?: string
}

export interface IModal {
	open: boolean
	searchText: string
	quantity: number
	textFocused: boolean
	visibleList: boolean
	searchItems: IProducto[] | null
	itemSelected: boolean
	editing?: boolean
}

export interface IModalPersona {
	open: boolean
	name: string
}

export interface TabPanelProps {
	children?: React.ReactNode
	index: any
	value: any
}

interface IDataSet {
	label: string
	fill: boolean
	lineTension: number
	backgroundColor: string
	borderColor: string
	borderCapStyle: string | 'butt'
	borderDash: any
	borderDashOffset: number
	borderJoinStyle: string | 'miter'
	pointBorderColor: string
	pointBackgroundColor: string
	pointBorderWidth: number
	pointHoverRadius: number
	pointHoverBackgroundColor: string
	pointHoverBorderColor: string
	pointHoverBorderWidth: number
	pointRadius: number
	pointHitRadius: number
	data: number[]
}

export interface IPerformanceChartData {
	salesData?: {
		labels: string[]
		datasets: IDataSet[]
	}
}
