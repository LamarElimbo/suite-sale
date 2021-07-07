import React, { useState, useEffect } from 'react'
import { Layout, Content, SideNav } from '../components/layout'
import { ItemCard, ItemCardList } from '../components/items'
import SideNavContent from '../components/side-nav'


const IndexPage = ({location}) => {
  const [filter, setFilter] = useState('all items')

  useEffect(() => {
    if (location.search) {
      const urlParams = new URLSearchParams(location.search);
      setFilter(urlParams.get('tag'))
    } else {
      setFilter('all items')
    }
  }, [location, filter])
  
  return (
    <Layout pageTitle="Home Page">
      <Content>
        <ItemCard create='true' />
        <ItemCardList filter={filter} />
      </Content>
      <SideNav>
        <SideNavContent tagSearch={setFilter} />
      </SideNav>
    </Layout>
  )
}

export default IndexPage