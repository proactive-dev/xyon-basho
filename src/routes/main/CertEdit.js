import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { DISTANCE_LIMIT, ERROR, INFO, ISSUE_FEE } from '../../constants/AppConfigs'
import { openNotificationWithIcon } from '../../components/Messages'
import MintForm from '../../components/MintForm'
import SearchForm from '../../components/SearchForm'
import PlaceList from '../../components/PlaceList'
import MintResult from '../../components/MintResult'
import { hideLoader, showLoader } from '../../appRedux/actions/Progress'
import { coordWithResolution, getDistanceFromCoordinates, uploadIPFS } from '../../util/helpers'

let service

const CertEdit = (props) => {
  const dispatch = useDispatch()
  const chain = useSelector(state => state.chain)
  const {signer, contract, ipfs} = chain
  const {intl} = props
  const [current, setCurrent] = useState(0)
  const [coordinate, setCoordinate] = useState({lat: 0, lng: 0})
  const [places, setPlaces] = useState([])
  const [place, setPlace] = useState()

  useEffect(() => {
    service = new window.google.maps.places.PlacesService(document.createElement('div'))
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        setCoordinate({
          lat: coordWithResolution(position.coords.latitude),
          lng: coordWithResolution(position.coords.longitude)
        })
      })
    } else {
      openNotificationWithIcon(INFO, intl.formatMessage({id: 'alert.locationServiceDisabled'}))
    }
  }, [])

  const search = async ({keyword}) => {
    const reqParams = {
      query: keyword,
      fields: ['name', 'formatted_address', 'geometry', 'place_id']
    }
    dispatch(showLoader())
    service.findPlaceFromQuery(reqParams, (results, status) => {
      dispatch(hideLoader())
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (results.length > 0) {
          setPlaces(results)
          setCurrent(1)
        } else {
          openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.search.result.empty'}))
        }
      } else {
        openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.search.failed'}))
      }
    })
  }

  const selectPlace = async (place) => {
    setPlace(place)
    setCurrent(2)
  }

  const mint = async (values) => {
    const geometry = {
      lat: coordWithResolution(place.geometry.location.lat()),
      lng: coordWithResolution(place.geometry.location.lng())
    }
    const distance = getDistanceFromCoordinates(geometry, coordinate)
    if (distance > DISTANCE_LIMIT) {
      openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.insufficientBalance'}))
      return
    }

    // TODO: Issuer fee logic
    const balance = await signer.getBalance()
    if (balance.lt(ISSUE_FEE)) {
      openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.insufficientBalance'}))
      return
    }

    dispatch(showLoader())
    const photoHash = await uploadIPFS({ipfs, file: values.images[0]})
    if (photoHash) {
      contract.mint(
        [...ethers.utils.toUtf8Bytes(place.name)],
        [...ethers.utils.toUtf8Bytes(place.formatted_address)],
        geometry,
        coordinate,
        photoHash,
        {value: ISSUE_FEE}
      ).then((result) => {
        dispatch(hideLoader())
        setCurrent(3)
      }).catch((error) => {
        dispatch(hideLoader())
        openNotificationWithIcon(ERROR, error.message)
      })
    } else {
      dispatch(hideLoader())
      openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.fail2UploadIPFS'}))
    }
  }

  return (
    <div className="gx-mt-4">
      {
        current === 0 &&
        <SearchForm
          {...props}
          onSubmit={search}
        />
      }
      {
        current === 1 &&
        <PlaceList
          {...props}
          data={places}
          onSelect={selectPlace}
        />
      }
      {
        current === 2 &&
        <MintForm
          {...props}
          place={place}
          coordinate={coordinate}
          onSubmit={mint}
        />
      }
      {
        current === 3 &&
        <MintResult
          {...props}
        />
      }
    </div>
  )
}

export default withRouter(injectIntl(CertEdit))
