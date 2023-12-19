<script>
import { v4 as generateId } from 'uuid'

export default {
  name: 'CountDown',
  filters: {
    twoDigits(value) {
      if (value.toString().length <= 1) {
        return `0${value.toString()}`
      }
      return value.toString()
    },
  },
  props: {
    deadline: {
      type: String,
    },
    stop: {
      type: Boolean,
    },
    showDays: {
      type: Boolean,
      required: false,
      default: true,
    },
    showHours: {
      type: Boolean,
      required: false,
      default: true,
    },
    showMinutes: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSeconds: {
      type: Boolean,
      required: false,
      default: true,
    },
    labels: {
      type: Object,
      required: false,
      default() {
        return {
          days: 'Days',
          hours: 'Hours',
          minutes: 'Minutes',
          seconds: 'Seconds',
        }
      },
    },
    countdownSize: {
      type: String,
      required: false,
    },
    labelSize: {
      type: String,
      required: false,
    },
  },
  data() {
    const uuid = generateId()
    return {
      now: Math.trunc(new Date().getTime() / 1000),
      date: null,
      interval: null,
      diff: 0,
      show: false,
      timeData: [
        {
          current: 0,
          previous: 0,
          label: this.labels.days,
          elementId: `flip-card-days-${uuid}`,
          show: this.showDays,
        },
        {
          current: 0,
          previous: 0,
          label: this.labels.hours,
          elementId: `flip-card-hours-${uuid}`,
          show: this.showHours,
        },
        {
          current: 0,
          previous: 0,
          label: this.labels.minutes,
          elementId: `flip-card-minutes-${uuid}`,
          show: this.showMinutes,
        },
        {
          current: 0,
          previous: 0,
          label: this.labels.seconds,
          elementId: `flip-card-seconds-${uuid}`,
          show: this.showSeconds,
        },
      ],
    }
  },
  computed: {
    seconds() {
      return Math.trunc(this.diff) % 60
    },
    minutes() {
      return Math.trunc(this.diff / 60) % 60
    },
    hours() {
      return Math.trunc(this.diff / 60 / 60) % 24
    },
    days() {
      return Math.trunc(this.diff / 60 / 60 / 24)
    },
  },
  watch: {
    deadline() {
      const endTime = this.deadline
      this.date = Math.trunc(Date.parse(endTime.replace(/-/g, '/')) / 1000)
      if (!this.date) {
        throw new Error("Invalid props value, correct the 'deadline'")
      }
    },
    now() {
      this.diff = this.date - this.now
      if (this.diff <= 0 || this.stop) {
        this.diff = 0
        this.updateTime(3, 0)
      } else {
        this.updateAllCards()
      }
    },
    diff(value) {
      if (value === 0) {
        this.$emit('timeElapsed')
        this.updateAllCards()
      }
    },
  },
  created() {
    if (!this.deadline) {
      throw new Error("Missing props 'deadline'")
    }
    const endTime = this.deadline
    this.date = Math.trunc(Date.parse(endTime.replace(/-/g, '/')) / 1000)
    if (!this.date) {
      throw new Error("Invalid props value, correct the 'deadline'")
    }
    this.interval = setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },
  mounted() {
    if (this.diff !== 0) {
      this.show = true
    }
  },
  methods: {
    updateAllCards() {
      this.updateTime(0, this.days)
      this.updateTime(1, this.hours)
      this.updateTime(2, this.minutes)
      this.updateTime(3, this.seconds)
    },
    updateTime(idx, newValue) {
      if (idx >= this.timeData.length || newValue === undefined) {
        return
      }

      if (window.requestAnimationFrame) {
        this.frame = requestAnimationFrame(this.updateTime.bind(this))
      }

      const d = this.timeData[idx]
      const val = newValue < 0 ? 0 : newValue
      const el = document.querySelector(`#${d.elementId}`)

      if (val !== d.current) {
        d.previous = d.current
        d.current = val

        if (el) {
          el.classList.remove('flip')
          void el.offsetWidth
          el.classList.add('flip')
        }

        if (idx === 0) {
          const els = el.querySelectorAll('span b')
          if (els) {
            for (const e of els) {
              const cls = e.classList[0]
              if (newValue / 1000 >= 1) {
                if (!cls.includes('-4digits')) {
                  const newCls = `${cls}-4digits`
                  e.classList.add(newCls)
                  e.classList.remove(cls)
                }
              } else if (cls.includes('-4digits')) {
                const newCls = cls.replace('-4digits', '')
                e.classList.add(newCls)
                e.classList.remove(cls)
              }
            }
          }
        }
      }
    },
  },
  beforeUnmount() {
    if (window.cancelAnimationFrame) {
      cancelAnimationFrame(this.frame)
    }
  },
  unmounted() {
    clearInterval(this.interval)
  },
}
</script>

<template>
  <div class="flip-clock">
    <template
      v-for="data in timeData"
      v-show="show"
    >
      <span
        v-show="data.show"
        :id="data.elementId"
        :key="data.label"
      >
        <span>
          <span>{{ data.current | twoDigits }}</span>
          <span :data-value="data.current | twoDigits" />
          <span :data-value="data.previous | twoDigits" />
          <span :data-value="data.previous | twoDigits" />
          <span v-if="data.label === 'Minutes'">:</span>
        </span>
      </span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.flip-clock {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 30px;
  color: var(--white);
  border-radius: 28px;
  height: 56px;
  padding: 13px 16px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
}
</style>
