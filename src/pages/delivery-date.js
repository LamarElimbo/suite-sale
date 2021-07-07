import * as React from 'react'
import { Layout, Content, SideNav } from '../components/layout'
import DeliveryDateForm from '../components/delivery-date-form'

const DeliveryDatePage = ({ location }) => {
  return (
    <Layout pageTitle="Select Delivery Date">
      <Content>
        <DeliveryDateForm
          itemId={location.state.item}
          sellerId={location.state.sellerId}
          deliveryMethod={location.state.deliveryMethod} />
      </Content>
      <SideNav>
      </SideNav>
    </Layout>
  )
}

export default DeliveryDatePage