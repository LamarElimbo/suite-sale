import * as React from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const SavedItemsPage = () => {

  const firebaseContext = useUser()
  !firebaseContext?.userAuth && navigate('/sign-in')
  return (
    <Layout pageTitle="Your Cart" headerLink="Logout">
      <Content contentTitle="Your cart">
        <ItemCardList filter="saved"/>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default SavedItemsPage