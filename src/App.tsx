import React, { useEffect, useState } from 'react'
import { Profile } from 'passport'
import styled from 'styled-components'
import 'reset-css'
import FeatureLanes from './components/FeatureLanes'
import { getJSON } from './fetch'
import { receiveLists } from './store/listReducer'
import { receiveTasks } from './store/taskReducer'
import { connect } from 'react-redux'
import { Title } from './components/common'

interface DispatchProps {
  receiveLists: typeof receiveLists
  receiveTasks: typeof receiveTasks
}

type Props = DispatchProps

const App = (props: Props) => {
  const [user, setUser] = useState<Profile | null | undefined>(undefined)

  useEffect(() => {
    getJSON('/api/auth/user').then(response => setUser(response.user)).catch(() => undefined)
    getJSON('/api/lists').then(response => props.receiveLists(response.lists)).catch(() => undefined)
    getJSON('/api/tasks').then(response => props.receiveTasks(response.tasks)).catch(() => undefined)
  }, [])

  return (
    <BackroundContainer>
      <Header>
        <Title>Project name</Title>
        <LoginButton user={user} />
      </Header>
      <FeatureLanes/>
    </BackroundContainer>
  )
}

const BackroundContainer = styled.div`
  position: relative;
  display: block;
  background: white;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin: auto;
  font-family: sans-serif;
  font-size: 14px;
  color: #333333;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`

const LoginButton = (props: { user?: Profile | null }) => {
  switch (props.user) {
    case undefined:
      return null
    case null:
      return <a href='/api/auth/google'>Sign in</a>
    default:
      return <div>{props.user.displayName} (<a href='/api/auth/logout'>Logout</a>)</div>
  }
}

const mapDispatchToProps = {
  receiveLists,
  receiveTasks
}

export default connect(undefined, mapDispatchToProps)(App)
