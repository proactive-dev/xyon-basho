import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Form, Input, Spin } from 'antd'
import ConfirmButton from './ConfirmButton'

const FormItem = Form.Item
const formRef = React.createRef()

const SearchForm = (props) => {
  const loader = useSelector(state => state.progress.loader)
  const {intl, onSubmit} = props

  return (
    <Spin spinning={loader}>
      <Form
        name="search-form"
        layout={'inline'}
        ref={formRef}
        onFinish={onSubmit}>
        <FormItem
          className="gx-w-100"
          name="keyword"
          rules={[
            {required: true, message: intl.formatMessage({id: 'alert.fieldRequired'})}
          ]}>
          <Input
            className="gx-mt-1 gx-mb-1"
            placeholder={intl.formatMessage({id: 'search.address'})}
            allowClear/>
        </FormItem>
      </Form>
      <ConfirmButton intl={intl} form={formRef} btnTitle={'search'} confirmEnabled={false}/>
    </Spin>
  )
}

export default withRouter(injectIntl(SearchForm))
