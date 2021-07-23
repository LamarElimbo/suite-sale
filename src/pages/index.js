import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { Layout, Content, SideNav } from '../components/layout'
import { ItemCard, ItemCardList } from '../components/items'
import SideNavContent from '../components/side-nav'
import * as LayoutCSS from '../css/layout.module.css'
import { useUser } from "../context/UserContext"

const IndexPage = ({ location }) => {
  const [filter, setFilter] = useState('all items')
  const firebaseContext = useUser()

  useEffect(() => {
    // Check to see if user is filtering items based on a tag
    if (location.search) {
      const urlParams = new URLSearchParams(location.search);
      setFilter(urlParams.get('tag'))
    } else {
      setFilter('all items')
    }
  }, [location, filter])

  return (
    <Layout pageTitle="Home">
      <Content>
        <ItemCard create='true' />
        <ItemCardList filter={filter} />
      </Content>
      <SideNav>
        {firebaseContext?.userData?.notifications.length > 0 &&
          <SideNavContent type='notifications' />
        }
        {firebaseContext?.userAuth ?
          <SideNavContent tagSearch={setFilter} />
          :
          <SideNavContent tagSearch={setFilter} message='welcome' />
        }
      </SideNav>
    </Layout>
  )
}

export default IndexPage