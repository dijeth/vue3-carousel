import { defineComponent, inject, ref, h, reactive, SetupContext } from 'vue'

import { defaultConfigs } from '@/partials/defaults'
import { CarouselConfig } from '@/types'

export default defineComponent({
  name: 'CarouselSlide',
  props: {
    index: {
      type: Number,
      default: 1,
    },
    isClone: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }: SetupContext) {
    const config: CarouselConfig = inject('config', reactive({ ...defaultConfigs }))
    const currentSlide = inject('currentSlide', ref(0))
    const slidesToScroll = inject('slidesToScroll', ref(0))
    const isSliding = inject('isSliding', ref(false))

    const isActive = (): boolean => props.index === currentSlide.value
    const isPrev = (): boolean => props.index === currentSlide.value - 1
    const isNext = (): boolean => props.index === currentSlide.value + 1
    const isVisible = (): boolean => {
      const min = Math.floor(slidesToScroll.value)
      const max = Math.ceil(slidesToScroll.value + config.itemsToShow - 1)

      return props.index >= min && props.index <= max
    }

    return () =>
      h(
        'li',
        {
          style: {
            width: `${100 / config.itemsToShow}%`,
            'transition-duration': `${config.transition}ms`,
          },
          class: {
            carousel__slide: true,
            'carousel__slide--clone': props.isClone,
            'carousel__slide--visible': isVisible(),
            'carousel__slide--active': isActive(),
            'carousel__slide--prev': isPrev(),
            'carousel__slide--next': isNext(),
            'carousel__slide--sliding': isSliding.value,
          },
          'aria-hidden': !isVisible(),
        },
        slots.default?.()
      )
  },
})
