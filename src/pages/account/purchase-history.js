import * as React from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const PurchaseHistoryPage = () => {

  const firebaseContext = useUser()
  if (!firebaseContext?.userAuth && typeof window !== 'undefined') navigate('/sign-in')
  return (
    <Layout pageTitle="Your Purchase History" headerLink="Logout">
      <Content contentTitle="Your purchase history">
        <ItemCardList filter="purchase history"/>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default PurchaseHistoryPage