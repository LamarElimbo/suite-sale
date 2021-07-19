import React, { useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { form, formTitle, inputItem, inputItem__label, inputItem__textInput, inputItem__submit } from '../css/form.module.css'

const LoginForm = () => {
  const email = useRef()
  const password = useRef('')
  const firebaseContext = useUser()
  const login = firebaseContext?.login

  function onSubmitLogin(e) {
    e.preventDefault()
    login(email.current.value, password.current.value)
    navigate('/')
  }

  return (
    <>
      <h2 className={formTitle}>Log into your account</h2>
        <form className={form} onSubmit={onSubmitLogin}>
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
                placeholder="*****"
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
    </>
  )
}

export default LoginForm