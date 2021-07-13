import React, { useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import { form, inputItem, inputItem__label, inputItem__textInput, inputItem__submit } from '../css/form.module.css'

const LoginPage = () => {
  const email = useRef()
  const password = useRef('')
  //const { login } = useUser()
  const firebaseContext = useUser()
  const login = firebaseContext?.login

  function onSubmit(e) {
    e.preventDefault()
    login(email.current.value, password.current.value)
    navigate('/')
  }

  return (
    <Layout pageTitle="Login Page">
      <Content>
        <form className={form} onSubmit={onSubmit}>
          <div className={inputItem}>
            <label>
              <p className={inputItem__label}>Email</p>
              <input className={inputItem__textInput}
                placeholder="example@gmail.com"
                type="text"
                ref={email} />
            </label>
          </div>
          <div className={inputItem}>
            <label>
              <p className={inputItem__label}>Password</p>
              <input className={inputItem__textInput}
                placeholder="Password"
                type="password"
                ref={password} />
            </label>
          </div>
          <div className={inputItem}>
            <input className={inputItem__submit}
              type="submit"
              value="Submit" />
          </div>
        </form>
      </Content>
      <SideNav></SideNav>
    </Layout>
  )
}

export default LoginPage