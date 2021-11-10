import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import Moment from 'moment'
import {
  CHAIN_ID,
  COMMON_DATE_FORMAT,
  COORDINATE_RESOLUTION,
  DEFAULT_DECIMALS,
  DEFAULT_PRECISION
} from '../constants/AppConfigs'

// main helper functions

export const removeDuplicates = (array) => {
  return (array === undefined || array.length === 0) ? [] : array.filter((v, i) => array.indexOf(v) === i)
}

export const matches = (array1, array2) => {
  if (array1.length !== array2.length) return false

  array1 = array1.filter(val => !_.some(array2, val))
  return _.isEmpty(array1)
}

export const isValidChain = (chainId) => {
  return chainId === CHAIN_ID
}

export const isPositive = (value) => {
  return BigNumber(value).isPositive()
}

export const ipfsLink = (fileHash) => {
  if (_.isEmpty(fileHash) || _.isUndefined(fileHash)) {
    return `/`
  }
  return `https://ipfs.io/ipfs/${fileHash}`
}

export const getDecimal = (value) => {
  return isNaN(value) ? parseInt(value, 10) : value
}

export const getFixed = (value, precision = DEFAULT_DECIMALS) => {
  return BigNumber(value).toFixed(precision).toString()
}

export const getPrecise = (value, precision = null) => {
  let precise = precision > DEFAULT_PRECISION ? DEFAULT_PRECISION : precision
  return BigNumber(value).toPrecision(precise).toString()
}

export const getRealBalance = (value, base = DEFAULT_DECIMALS) => {
  return BigNumber(value).div(BigNumber(10).exponentiatedBy(base)).toString()
}

export const getTableLocaleData = (intl) => {
  return {
    filterTitle: intl.formatMessage({id: 'filter'}),
    filterConfirm: intl.formatMessage({id: 'ok'}),
    filterReset: intl.formatMessage({id: 'reset'}),
    emptyText: intl.formatMessage({id: 'no.data'})
  }
}

export const getDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString()
}

export const getDateTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString()
}

export const timestamp2Date = (timestamp) => {
  return Moment.unix(timestamp).format(COMMON_DATE_FORMAT)
}

export const getYearMonth = (dateTimeString) => {
  const dateTime = new Date(dateTimeString)
  const year = dateTime.getFullYear()
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
  return `${year}-${month}`
}

export const isThisMonth = (dateTimeString) => {
  const dateTime = new Date(dateTimeString)
  const now = new Date()
  return (dateTime.getFullYear() === now.getFullYear()) && (dateTime.getMonth() === now.getMonth())
}

export const uploadIPFS = async ({ipfs, file}) => {
  try {
    const arrayBuffer = await readFileAsync(file)
    const result = await ipfs.add(Buffer(arrayBuffer))
    return result && result.path
  } catch (err) {
    console.error('Error pinning file to IPFS', err)
    return null
  }
}

export const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const dataURItoFile = (dataURI, fileName) => {
  let u8Array = dataURItoU8Array(dataURI)
  return new File(u8Array[1], fileName, {type: u8Array[0]})
}

export const dataURItoBlob = (dataURI) => {
  let u8Array = dataURItoU8Array(dataURI)
  return new Blob(u8Array[1], {type: u8Array[0]})
}

export const dataURItoU8Array = (dataURI) => {
  let arr = dataURI.split(',')
  let bStr
  if (arr[0].indexOf('base64') >= 0) {
    bStr = atob(arr[1])
  } else {
    bStr = unescape(arr[1])
  }
  let mime = arr[0].split(':')[1].split(';')[0]
  // let bStr = atob(arr[1])
  // let mime = arr[0].match(/:(.*?);/)[1]

  let n = bStr.length
  let u8Arr = new Uint8Array(n)
  while (n--) {
    u8Arr[n] = bStr.charCodeAt(n)
  }
  return [mime, [u8Arr]]
}

export function numberFormat(inputNumber) {
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const bigNumberArrayToString = (bigNumberArray) => {
  let _numArr = bigNumberArray.map(_char => _char.toNumber())
  return new TextDecoder().decode(Uint8Array.from(_numArr))
}

export const coordWithResolution = (value) => {
  return new BigNumber(value * COORDINATE_RESOLUTION).toFixed(0)
}

export const coordWithoutResolution = (value) => {
  return new BigNumber(value / COORDINATE_RESOLUTION).toFixed()
}

export const coordinateAsString = ({lat, lng}) => {
  return `(${coordWithoutResolution(lat)}, ${coordWithoutResolution(lng)})`
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export const getDistanceFromCoordinates = (coord1, coord2) => {
  const lat1 = coord1.lat / COORDINATE_RESOLUTION
  const lng1 = coord1.lng / COORDINATE_RESOLUTION
  const lat2 = coord2.lat / COORDINATE_RESOLUTION
  const lng2 = coord2.lng / COORDINATE_RESOLUTION
  const radius = 6371 // unit: km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(radius * c * 1000) // Distance in meter
}
