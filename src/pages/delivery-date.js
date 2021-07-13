import * as React from 'react'
import { Layout, Content, SideNav } from '../components/layout'
import DeliveryDateForm from '../components/delivery-date-form'

const DeliveryDatePage = ({ location }) => {
  return (
    <Layout pageTitle="Select Delivery Date">
      <Content>
        <DeliveryDateForm
          item={location.state?.item}
          deliveryMethod={location.state?.deliveryMethod} />
      </Content>
      <SideNav>
      </SideNav>
    </Layout>
  )
}

export default DeliveryDatePage