import React, { Component, Fragment } from 'react'
import { Measure } from 'react-measure'
import { Compose, renderProps } from 'react-powerplug'
import styled from 'styled-components'

class Scroll extends Component {
  state = {
    scroll: 0
  }

  update = () => this.setState({ scroll: window.scrollY })

  componentDidMount () {
    window.addEventListener('scroll', this.update)
    this.update()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.update)
  }

  render () {
    const { children } = this.props

    if (typeof children === 'function') {
      return children(this.state)
    }

    return null
  }
}

const normalize = measurements =>
  Object.entries(measurements).reduce(
    (vals, [key, value], i, arr) => [
      ...vals,
      {
        key,
        start: value.top - arr[0][1].top,
        finish: value.top - arr[0][1].top + value.height
      }
    ],
    []
  )

const Spy = props => {
  let converter = {}

  return (
    <Compose components={[Measure, Scroll]}>
      {({ bind, measurements }, { scroll }) => {
        const binder = (key, value) => {
          converter[key] = value

          return bind(key)
        }

        const active =
          measurements &&
          normalize(measurements).find(
            ({ start, finish }) => scroll >= start && scroll < finish
          )

        return renderProps(props, {
          bind: binder,
          active: active && converter[active.key]
        })
      }}
    </Compose>
  )
}

const Block = styled.div`
  background-color: ${props => props.color || 'black'}

  width: 100%;
  height: 200vh;
`

const Nav = styled.nav`
  position: fixed;
  top: 0;

  width: 100%;
  display: flex;
  justify-content: center;

  color: ${props => props.color || 'black'};
`

export default () => (
  <Spy>
    {({ bind, active }) => (
      <Fragment>
        <Nav color={active}>Hello Spy</Nav>
        <Block innerRef={bind('1', 'white').ref} />
        <Block innerRef={bind('2', 'black').ref} color='white' />
        <Block innerRef={bind('3', 'white').ref} />
      </Fragment>
    )}
  </Spy>
)
