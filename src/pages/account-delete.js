import * as React from 'react'
import { Layout, Content, SideNav } from '../components/layout'
import { form, inputItem, inputItem__submit } from '../components/form.module.css'

const DeleteAccountPage = () => {
  return (
    <Layout pageTitle="Delete Account">
      <Content>
        <form className={form}>
          <div className={inputItem}>
            <input className={inputItem__submit}
              type="submit"
              value="Submit" />
          </div>
        </form>
      </Content>
      <SideNav>
        <p>Deleting your account will remove all of your data...</p>
      </SideNav>
    </Layout>
  )
}

export default DeleteAccountPage