import * as React from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { Layout, Content } from '../components/layout'
import ItemFormInfo from '../components/item-form-info'

const ItemCreatePage = () => {
  const firebaseContext = useUser()
  if (!firebaseContext?.userAuth && typeof window !== 'undefined') navigate('/sign-in')
  return (
    <Layout pageTitle="Create New Listing">
      <Content contentTitle="Create a new listing" titlePosition='center' sideNav={false}>
        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
          <ItemFormInfo />
        </div>
      </Content>
    </Layout>
  )
}

export default ItemCreatePage