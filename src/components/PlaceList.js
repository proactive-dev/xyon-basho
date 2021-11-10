import React from 'react'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { List } from 'antd'

const PlaceList = (props) => {
  const {intl, data, onSelect} = props

  return (
    <List
      bordered
      header={<div>{intl.formatMessage({id: 'search.result'})}: {data.length} {intl.formatMessage({id: 'cases'})}</div>}
      dataSource={data}
      renderItem={item =>
        <List.Item key={item.place_id} className="gx-pointer" onClick={() => onSelect(item)}>
          <List.Item.Meta
            title={item.name}
            description={item.formatted_address}
          />
        </List.Item>
      }
    />
  )
}

export default withRouter(injectIntl(PlaceList))
