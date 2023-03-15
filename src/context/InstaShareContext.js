import React from 'react'

const InstaShareContext = React.createContext({
  input: '',
  activeLink: '',
  onChangeInput: () => {},
  changeActiveButton: () => {},
})
export default InstaShareContext
