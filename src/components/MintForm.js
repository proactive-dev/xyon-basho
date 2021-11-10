import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Spin, Upload } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import ConfirmButton from './ConfirmButton'
import { coordinateAsString } from '../util/helpers'

const FormItem = Form.Item
const formRef = React.createRef()

const MintForm = (props) => {
  const loader = useSelector(state => state.progress.loader)
  const {intl, place, coordinate, onSubmit} = props
  const geometry = place.geometry.location

  const normalizeFile = (e) => {
    if (e && e.file) {
      return [e.file]
    }
    if (e && e.fileList) {
      if (e.fileList.length > 1) {
        return e.fileList.shift()
      } else {
        return e.fileList[0]
      }
    }
    return []
  }

  return (
    <Spin spinning={loader}>
      <Form
        name="mint-form"
        layout={'vertical'}
        ref={formRef}
        onFinish={onSubmit}>
        <FormItem
          name="name"
          label={intl.formatMessage({id: 'name'})}>
          <span className="ant-input gx-mt-1 gx-mb-1">{place.name}</span>
        </FormItem>
        <FormItem
          name="formattedAddress"
          label={intl.formatMessage({id: 'location'})}>
          <span className="ant-input gx-mt-1 gx-mb-1">{place.formatted_address}</span>
        </FormItem>
        <FormItem
          name="geometry"
          label={intl.formatMessage({id: 'geometry'})}>
          <span className="ant-input gx-mt-1 gx-mb-1">{`(${geometry.lat()}, ${geometry.lng()})`}</span>
        </FormItem>
        <FormItem
          name="coordinate"
          label={intl.formatMessage({id: 'coordinate'})}>
          <span className="ant-input gx-mt-1 gx-mb-1">{coordinateAsString(coordinate || {})}</span>
        </FormItem>
        <FormItem
          name="images"
          label={intl.formatMessage({id: 'image'})}
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
          rules={[
            {required: true, message: intl.formatMessage({id: 'alert.fieldRequired'})}
          ]}>
          <Upload.Dragger
            beforeUpload={() => {
              return false
            }}
            listType={'picture'}
            maxCount={1}>
            <p className="ant-upload-drag-icon">
              <PictureOutlined/>
            </p>
            <p className="ant-upload-text"><FormattedMessage id={'upload.image.text'}/></p>
            <p className="ant-upload-hint"><FormattedMessage id={'upload.image.hint'}/></p>
          </Upload.Dragger>
        </FormItem>
      </Form>
      <ConfirmButton intl={intl} form={formRef} btnTitle={'issue'} confirmEnabled={false}/>
    </Spin>
  )
}

export default withRouter(injectIntl(MintForm))
