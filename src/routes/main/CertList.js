import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { List, Spin } from 'antd'
import { hideLoader, showLoader } from '../../appRedux/actions/Progress'
import { openNotificationWithIcon } from '../../components/Messages'
import { CERTIFICATE, ERROR, VIEW } from '../../constants/AppConfigs'
import { bigNumberArrayToString, timestamp2Date } from '../../util/helpers'

const CertList = (props) => {
  const dispatch = useDispatch()
  const loader = useSelector(state => state.progress.loader)
  const chain = useSelector(state => state.chain)
  const {intl} = props
  const {contract} = chain
  const [certs, setCerts] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    dispatch(showLoader())
    contract.getCertificates().then((result) => {
      dispatch(hideLoader())
      let _certs = []
      result[0].forEach((id, index) => {
        _certs.push({
          id: id.toNumber(),
          name: bigNumberArrayToString(result[1][index]['name']),
          formattedAddress: bigNumberArrayToString(result[1][index]['formattedAddress']),
          geometry: {
            lat: result[1][index]['geometry']['lat'].toNumber(),
            lng: result[1][index]['geometry']['lng'].toNumber()
          },
          coordinate: {
            lat: result[1][index]['location']['lat'].toNumber(),
            lng: result[1][index]['location']['lng'].toNumber()
          },
          fileHash: result[1][index]['fileHash'],
          issuedAt: timestamp2Date(result[1][index]['issuedAt'].toNumber())
        })
      })
      setCerts(_certs)
    }).catch((error) => {
      dispatch(hideLoader())
      openNotificationWithIcon(ERROR, error.message)
    })
  }

  return (
    <Spin spinning={loader}>
      <List
        bordered
        header={<div>{certs.length} {intl.formatMessage({id: 'certificates'})}</div>}
        dataSource={certs}
        renderItem={item =>
          <List.Item key={item.id}>
            <List.Item.Meta
              title={item.issuedAt}
              description={item.name}
            />
            <Link to={`/${CERTIFICATE}/${VIEW}/${item.id}`} className="gx-pointer gx-link gx-text-underline">
              <FormattedMessage id="detail"/>
            </Link>
          </List.Item>
        }
      />
    </Spin>
  )
}

export default withRouter(injectIntl(CertList))
