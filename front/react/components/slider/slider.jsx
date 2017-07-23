import React, { Component } from 'react'
import Hammer from 'react-hammerjs'
import styles from './slider.scss'

const SENSITIVITY = 20

class Slider extends Component {
  constructor (props) {
    super(props)
    const {slides} = props.slider
    this.state = {
      numberOfSlides: slides.length,
      activeSlide: 0,
      isEndingSliding: false,
      slides: slides,
      isSliding: false
    }

    this.swipe = this.swipe.bind(this)
  }

  setSliderContainerWidth () {
    let slideItemWidth = window.getComputedStyle(this.sliderContainer, ':before').getPropertyValue('content')
    slideItemWidth = slideItemWidth.replace(/['"]+/g, '') // removes double or single quotes
    this.sliderContainer.style.width = `${parseInt(slideItemWidth) * this.state.numberOfSlides}%`
  }

  applySliderTransform (value) {
    this.sliderContainer.style.transform = `translate3d(${value}%, 0, 0)`
  }

  goToSlide () {
    let activeSlide = this.state.activeSlide
    let timer = null

    if (activeSlide < 0) {
      activeSlide = 0
    } else if (this.state.activeSlide > this.state.numberOfSlides - 1) {
      activeSlide = this.state.numberOfSlides - 1
    }

    this.setState({
      activeSlide,
      isEndingSliding: true
    })

    const transformPercentage = -(100 / this.state.numberOfSlides) * this.state.activeSlide
    this.applySliderTransform(transformPercentage)

    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setState({isEndingSliding: false})
    }, 400)
  }

  finalSlide (percentage, {velocityX}) {
    let goToSlideId = this.state.activeSlide

    if (velocityX > 1) {
      goToSlideId = goToSlideId - 1
    } else if (velocityX < -1) {
      goToSlideId = goToSlideId + 1
    } else {
      if (percentage <= -(SENSITIVITY / this.state.numberOfSlides)) {
        goToSlideId = goToSlideId + 1
      } else if (percentage >= (SENSITIVITY / this.state.numberOfSlides)) {
        goToSlideId = goToSlideId - 1
      }
    }

    this.setState({ activeSlide: goToSlideId })
    this.goToSlide()
  }

  swipe (ev) {
    ev.preventDefault()
    const percentage = 100 / this.state.numberOfSlides * ev.deltaX / this.slider.offsetWidth
    const transformPercentage = percentage - 100 / this.state.numberOfSlides * this.state.activeSlide
    this.applySliderTransform(transformPercentage)
    this.setState({ isSliding: true })

    if (ev.isFinal) {
      this.setState({ isSliding: false })
      this.finalSlide(percentage, ev)
    }
  }

  generateSlides () {
    return this.state.slides.map((slide, slideIndex) => {
      return (
        <div
          key={slideIndex}
          className={`${styles.slider_item} ${this.state.activeSlide === slideIndex ? styles.slider_item_selected : ''}`}
          ref={(element) => { this.slide = element }}
        >
          <header className={styles.slider_item_header}>
            <span className={styles.slider_item_heading}>{slide.title}</span>
            <span>{slideIndex + 1} / {this.state.numberOfSlides}</span>
          </header>
          <div className={styles.slider_item_image}>
            <img src={`/assets/img/${slide.img.location}`} />
          </div>
          <div className={styles.slider_item_description}>
            <p>{slide.description}</p>
          </div>
        </div>
      )
    })
  }

  componentDidMount () {
    this.setSliderContainerWidth()
    window.addEventListener('resize', this.setSliderContainerWidth.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setSliderContainerWidth)
  }

  render () {
    const hammerOptions = {
      recognizers: {
        pan: {
          threshold: 0,
          pointers: 0
        }
      }
    }

    return (
      <div
        className={styles.slider}
        ref={(element) => { this.slider = element }}
      >
        <Hammer
          options={hammerOptions}
          onPan={this.swipe}
        >
          <div
            className={`${styles.slider_container} ${this.state.isEndingSliding ? styles.slider_container_animating : ''} ${this.state.isSliding ? styles.slider_container_sliding : ''}`}
            ref={(element) => { this.sliderContainer = element }}
          >
            {this.generateSlides()}
          </div>
        </Hammer>
      </div>
    )
  }
}

export default Slider

