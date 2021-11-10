import React from 'react'
import { Form, Image } from 'antd'
import { coordinateAsString, ipfsLink } from '../util/helpers'

const FormItem = Form.Item

const CertViewForm = (props) => {
  const {intl, cert} = props
  const {id, name, formattedAddress, geometry, coordinate, issuedAt, fileHash} = cert

  return (
    <Form
      name="cert-view-form"
      layout={'vertical'}>
      <FormItem name="file" label={intl.formatMessage({id: 'image'})}>
        <Image className="gx-mt-1 gx-mb-1" src={ipfsLink(fileHash)} alt={intl.formatMessage({id: 'image'})}/>
      </FormItem>
      <FormItem name="id" label={'ID'}>
        <span className="ant-input gx-mt-1 gx-mb-1">{id || ''}</span>
      </FormItem>
      <FormItem name="issuedAt" label={intl.formatMessage({id: 'issue.date'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{issuedAt || ''}</span>
      </FormItem>
      <FormItem name="name" label={intl.formatMessage({id: 'name'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{name || ''}</span>
      </FormItem>
      <FormItem name="formattedAddress" label={intl.formatMessage({id: 'location'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{formattedAddress || ''}</span>
      </FormItem>
      <FormItem name="geometry" label={intl.formatMessage({id: 'geometry'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{coordinateAsString(geometry || {})}</span>
      </FormItem>
      <FormItem name="coordinate" label={intl.formatMessage({id: 'coordinate'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{coordinateAsString(coordinate || {})}</span>
      </FormItem>
    </Form>
  )
}

export default CertViewForm
