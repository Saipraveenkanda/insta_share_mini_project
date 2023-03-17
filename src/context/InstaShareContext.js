import React from 'react'

const InstaShareContext = React.createContext({
  activeLink: '',
  changeActiveButton: () => {},
})
export default InstaShareContext
