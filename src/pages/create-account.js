import React, { useState, useEffect, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import { form, inputItem, inputItem__label, inputItem__textInput, inputItem__submit } from '../css/form.module.css'

const CreateAccountPage = () => {
  const email = useRef('')
  const apartment = useRef()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState('')
  const { signup } = useUser()

  function onChangePassword(e) { setPassword(e.target.value) }
  function onChangeConfirmPassword(e) { setConfirmPassword(e.target.value) }

  async function onSubmit(e) {

    e.preventDefault()

    try {
      await signup(email.current.value, password, apartment.current.value)
      navigate('/')
    } catch {
      console.log("Failed to sign up")
    }
  }

  useEffect(() => {
    if (password === confirmPassword) {
      setPasswordMatch('Passwords match')
    } else {
      setPasswordMatch("Passwords don't match")
    }
  }, [password, confirmPassword])

  return (
    <Layout pageTitle="Create Account Page" headerLink="Login">
      <Content>
        <form className={form} onSubmit={onSubmit}>
          <div className={inputItem}>
            <label>
              <p className={inputItem__label}>Your email</p>
              <input className={inputItem__textInput}
                placeholder="Email"
                type="text"
                ref={email} />
            </label>
          </div>
          <div className={inputItem}>
            <label>
              <p className={inputItem__label}>Your apartment number</p>
              <input className={inputItem__textInput}
                placeholder="###"
                type="text"
                maxLength="3"
                ref={apartment} />
            </label>
          </div>
          <div className={inputItem}>
            <label>
              <p className={inputItem__label}>Password</p>
              <input className={inputItem__textInput}
                placeholder="Password"
                type="password"
                value={password || ""}
                onChange={onChangePassword} />
            </label>
          </div>
          <div className={inputItem}>
            <label>
              <p className={inputItem__label}>Confirm Password</p>
              <input className={inputItem__textInput}
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword || ""}
                onChange={onChangeConfirmPassword} />
            </label>
            <p>{(confirmPassword.length > 0) ? passwordMatch : ""}</p>
          </div>
          <div className={inputItem}>
            <input className={inputItem__submit}
              type="submit"
              value="Submit" />
          </div>
        </form>
      </Content>
      <SideNav>
        <p>Note about how your apartment number will be used.</p>
      </SideNav>
    </Layout>
  )
}

export default CreateAccountPage