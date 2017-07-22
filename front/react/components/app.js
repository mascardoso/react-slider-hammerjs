import React, { Component } from 'react'
import Slider from './slider/slider.jsx'
import {slider} from './data.js'

class App extends Component {
  render () {
    return (
      <div>
        <Slider
          slider={slider}
        />
      </div>
    )
  }
}

export default App
