<template>
  <q-page>
      <div class="page row wrap justify-center items-center">
        <div class="wrap_box">
          <div class="wrap_header row wrap justify-between items-center">
            <div class="wrap_score">SCORE {{score}}</div>
            <div class="wrap_heart"><q-icon :name="heartSvg" v-for="(heart, i) in hearts" :key="i"/></div>
          </div><!--end.wrap_header-->
          <div class="wrap_content">
            <div class="wrap_computer row wrap justify-center items-center">
              <q-icon :name="computerSvg" size="7rem" />
            </div><!--end.wrap_computer-->
            <div class="wrap_my row wrap justify-between items-center">
              <q-btn round :icon="rockSvg" @click="onClickButton('rock')" flat dense :disable="buttonDisableState" class="myrps rock"/>
              <q-btn round :icon="paperSvg" @click="onClickButton('paper')" flat dense :disable="buttonDisableState" class="myrps paper"/>
              <q-btn round :icon="scissorsSvg" @click="onClickButton('scissors')" flat dense :disable="buttonDisableState" class="myrps scissors"/>
            </div><!--end.wrap_my-->
          </div><!--end.wrap_content-->
          <div class="wrap_footer">
            © 2020 bless studio. All rights reserved.
          </div><!--end.wrap_footer-->
        </div><!--end.wrap_box-->
        <div class="rockpaperscissors text-center" >
          <div class="item">Rock</div>
          <div class="item">Paper</div>
          <div class="item">Scissors</div>
        </div>
        <div class="wrap_result_effect text-center" v-if="showResultEffect">
          <div class="">{{ result }}</div>
          <div class="">{{result_effect}}</div>
        </div>
        <div class="wrap_gamestart absolute-center row justify-center items-center" v-if="showGameStart" >
          <div class="box_gamestart text-center">
            <div class="title">
              <q-icon :name="computerSvg"></q-icon>
              <q-icon :name="paperSvg"></q-icon>
              <q-icon :name="scissorsSvg"></q-icon>
              <!-- ROCK<br>PAPER<br>SCISSORS -->
            </div>
            <q-btn flat class="start animate__flash" @click="onStartGame">GAME START</q-btn>
          </div>
        </div>
        <div class="wrap_retry absolute-center row justify-center items-center"  v-if="showRetry" >
          <div class="box_retry text-center">
            <div class="score">SCORE<br>{{score}}</div>
            <q-btn flat class="retry animate__flash" @click="onRetryGame">RETRY</q-btn>
          </div>
        </div>
      </div><!--end.page-->
      <div class="plusScore" v-show="plusScore">+{{ plusScore }}</div>
    <audio src="../assets/rps.mp3" crossorigin="anonymous" ref="audio_rps"></audio>
    <audio src="../assets/success.mp3" crossorigin="anonymous" ref="audio_success"></audio>
    <audio src="../assets/fail.mp3" crossorigin="anonymous" ref="audio_fail"></audio>
    <audio src="../assets/same.mp3" crossorigin="anonymous" ref="audio_same"></audio>
  </q-page>
</template>

<script>
const scores = {
  scissors: 1,
  rock: 0,
  paper: -1
}
let changeHandInterval = null
const context = new (window.AudioContext || window.webkitAudioContext)()
let sound2 = null

import { gsap } from 'gsap'
import Sound2 from '../plugin/sound2'
export default {
  data () {
    return {
      showGameStart: true,
      showRetry: false,
      tryNumber: 0,
      hearts: 3,
      result: '',
      score: 0,
      curIcon: 'rock',
      buttonDisableState: true,
      result_effect: '',
      showResultEffect: false,
      cur_combo: -1,
      plusScore: 0,
      tlFail: null,
      tlSuccess: null,
      tlRockpaperscissors: null,
      rockColor: 'MistyRose',
      paperColor: 'MistyRose',
      scissorsColor: 'MistyRose'
    }
  },
  computed: { // computed는 캐싱이 된다.
    heartSvg () {
      const currentColor = 'MistyRose'
      return `img:data:image/svg+xml;charset=utf8,
      <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" 
      role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="${currentColor}" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z">
      </path>
      </svg>`
    },

    computerSvg () {
      const currentColor = 'MistyRose'
      let curSvg = ''
      switch (this.curIcon) {
        case 'rock':
          curSvg = `img:data:image/svg+xml;charset=utf8,
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-rock" class="svg-inline--fa fa-hand-rock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="${currentColor}" d="M408.864 79.052c-22.401-33.898-66.108-42.273-98.813-23.588-29.474-31.469-79.145-31.093-108.334-.022-47.16-27.02-108.71 5.055-110.671 60.806C44.846 105.407 0 140.001 0 187.429v56.953c0 32.741 14.28 63.954 39.18 85.634l97.71 85.081c4.252 3.702 3.11 5.573 3.11 32.903 0 17.673 14.327 32 32 32h252c17.673 0 32-14.327 32-32 0-23.513-1.015-30.745 3.982-42.37l42.835-99.656c6.094-14.177 9.183-29.172 9.183-44.568V146.963c0-52.839-54.314-88.662-103.136-67.911zM464 261.406a64.505 64.505 0 0 1-5.282 25.613l-42.835 99.655c-5.23 12.171-7.883 25.04-7.883 38.25V432H188v-10.286c0-16.37-7.14-31.977-19.59-42.817l-97.71-85.08C56.274 281.255 48 263.236 48 244.381v-56.953c0-33.208 52-33.537 52 .677v41.228a16 16 0 0 0 5.493 12.067l7 6.095A16 16 0 0 0 139 235.429V118.857c0-33.097 52-33.725 52 .677v26.751c0 8.836 7.164 16 16 16h7c8.836 0 16-7.164 16-16v-41.143c0-33.134 52-33.675 52 .677v40.466c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16v-27.429c0-33.03 52-33.78 52 .677v26.751c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16 0-33.146 52-33.613 52 .677v114.445z">
                    </path>
                    </svg>
                    `
          break
        case 'paper':
          curSvg = `img:data:image/svg+xml;charset=utf8,
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-paper" class="svg-inline--fa fa-hand-paper fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="${currentColor}" d="M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z">
                    </path>
                    </svg>
                    `
          break
        case 'scissors':
          curSvg = `img:data:image/svg+xml;charset=utf8,
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-scissors" class="svg-inline--fa fa-hand-scissors fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="${currentColor}" d="M256 480l70-.013c5.114 0 10.231-.583 15.203-1.729l118.999-27.427C490.56 443.835 512 417.02 512 386.277V180.575c0-23.845-13.03-45.951-34.005-57.69l-97.999-54.853c-34.409-19.261-67.263-5.824-92.218 24.733L142.85 37.008c-37.887-14.579-80.612 3.727-95.642 41.201-15.098 37.642 3.635 80.37 41.942 95.112L168 192l-94-9.141c-40.804 0-74 32.811-74 73.14 0 40.33 33.196 73.141 74 73.141h87.635c-3.675 26.245 8.692 51.297 30.341 65.006C178.657 436.737 211.044 480 256 480zm0-48.013c-25.16 0-25.12-36.567 0-36.567 8.837 0 16-7.163 16-16v-6.856c0-8.837-7.163-16-16-16h-28c-25.159 0-25.122-36.567 0-36.567h28c8.837 0 16-7.163 16-16v-6.856c0-8.837-7.163-16-16-16H74c-34.43 0-34.375-50.281 0-50.281h182c8.837 0 16-7.163 16-16v-11.632a16 16 0 0 0-10.254-14.933L106.389 128.51c-31.552-12.14-13.432-59.283 19.222-46.717l166.549 64.091a16.001 16.001 0 0 0 18.139-4.812l21.764-26.647c5.82-7.127 16.348-9.064 24.488-4.508l98 54.854c5.828 3.263 9.449 9.318 9.449 15.805v205.701c0 8.491-5.994 15.804-14.576 17.782l-119.001 27.427a19.743 19.743 0 0 1-4.423.502h-70z">
                    </path>
                    </svg>
                    `
          break
        default:
          curSvg = `img:data:image/svg+xml;charset=utf8,
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-paper" class="svg-inline--fa fa-hand-paper fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="${currentColor}" d="M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z">
                    </path>
                    </svg>
                    `
      }
      return curSvg
    },
    rockSvg () {
      const currentColor = this.rockColor
      return `img:data:image/svg+xml;charset=utf8,
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-rock" class="svg-inline--fa fa-hand-rock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="${currentColor}" d="M408.864 79.052c-22.401-33.898-66.108-42.273-98.813-23.588-29.474-31.469-79.145-31.093-108.334-.022-47.16-27.02-108.71 5.055-110.671 60.806C44.846 105.407 0 140.001 0 187.429v56.953c0 32.741 14.28 63.954 39.18 85.634l97.71 85.081c4.252 3.702 3.11 5.573 3.11 32.903 0 17.673 14.327 32 32 32h252c17.673 0 32-14.327 32-32 0-23.513-1.015-30.745 3.982-42.37l42.835-99.656c6.094-14.177 9.183-29.172 9.183-44.568V146.963c0-52.839-54.314-88.662-103.136-67.911zM464 261.406a64.505 64.505 0 0 1-5.282 25.613l-42.835 99.655c-5.23 12.171-7.883 25.04-7.883 38.25V432H188v-10.286c0-16.37-7.14-31.977-19.59-42.817l-97.71-85.08C56.274 281.255 48 263.236 48 244.381v-56.953c0-33.208 52-33.537 52 .677v41.228a16 16 0 0 0 5.493 12.067l7 6.095A16 16 0 0 0 139 235.429V118.857c0-33.097 52-33.725 52 .677v26.751c0 8.836 7.164 16 16 16h7c8.836 0 16-7.164 16-16v-41.143c0-33.134 52-33.675 52 .677v40.466c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16v-27.429c0-33.03 52-33.78 52 .677v26.751c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16 0-33.146 52-33.613 52 .677v114.445z">
              </path>
              </svg>
              `
    },
    paperSvg () {
      const currentColor = this.paperColor
      return `img:data:image/svg+xml;charset=utf8,
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-paper" class="svg-inline--fa fa-hand-paper fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="${currentColor}" d="M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z">
              </path>
              </svg>
              `
    },
    scissorsSvg () {
      const currentColor = this.scissorsColor
      return `img:data:image/svg+xml;charset=utf8,
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="hand-scissors" class="svg-inline--fa fa-hand-scissors fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="${currentColor}" d="M256 480l70-.013c5.114 0 10.231-.583 15.203-1.729l118.999-27.427C490.56 443.835 512 417.02 512 386.277V180.575c0-23.845-13.03-45.951-34.005-57.69l-97.999-54.853c-34.409-19.261-67.263-5.824-92.218 24.733L142.85 37.008c-37.887-14.579-80.612 3.727-95.642 41.201-15.098 37.642 3.635 80.37 41.942 95.112L168 192l-94-9.141c-40.804 0-74 32.811-74 73.14 0 40.33 33.196 73.141 74 73.141h87.635c-3.675 26.245 8.692 51.297 30.341 65.006C178.657 436.737 211.044 480 256 480zm0-48.013c-25.16 0-25.12-36.567 0-36.567 8.837 0 16-7.163 16-16v-6.856c0-8.837-7.163-16-16-16h-28c-25.159 0-25.122-36.567 0-36.567h28c8.837 0 16-7.163 16-16v-6.856c0-8.837-7.163-16-16-16H74c-34.43 0-34.375-50.281 0-50.281h182c8.837 0 16-7.163 16-16v-11.632a16 16 0 0 0-10.254-14.933L106.389 128.51c-31.552-12.14-13.432-59.283 19.222-46.717l166.549 64.091a16.001 16.001 0 0 0 18.139-4.812l21.764-26.647c5.82-7.127 16.348-9.064 24.488-4.508l98 54.854c5.828 3.263 9.449 9.318 9.449 15.805v205.701c0 8.491-5.994 15.804-14.576 17.782l-119.001 27.427a19.743 19.743 0 0 1-4.423.502h-70z">
              </path>
              </svg>
              `
    }
  },
  methods: {
    onSound2 (type) {
      const audioElement = this.$refs['audio_' + type]
      sound2 = new Sound2(context, audioElement)
      sound2.play()
    },
    changeHand () {
      changeHandInterval = setInterval(() => {
        if (this.curIcon === 'rock') {
          this.curIcon = 'paper'
        } else if (this.curIcon === 'paper') {
          this.curIcon = 'scissors'
        } else {
          this.curIcon = 'rock'
        }
      }, 100)
    },
    onClickButton (choice) {
      this[choice + 'Color'] = 'rgb(209, 49, 21)'
      this.buttonDisableState = true
      clearInterval(changeHandInterval)
      const myScore = scores[choice]
      const cpuScore = scores[this.curIcon]
      const diff = myScore - cpuScore
      if (diff === 0) {
        this.result = 'TIE!'
        this.plusScore = 100
        this.score += this.plusScore
        this.onSound2('same')
        this.tlPlusScore.restart()
      } else if ([-1, 2].includes(diff)) {
        this.cur_combo += 1
        this.result_effect = this.cur_combo === 0 ? '' : (this.cur_combo === 1 ? '' : this.cur_combo) + 'COMBO'
        this.plusScore = (this.cur_combo + 1) * 200
        this.score += this.plusScore
        this.result = 'WIN!'
        this.tlSuccess.restart()
      } else {
        this.result = 'LOSE!'
        this.hearts -= 1
        this.cur_combo = -1
        this.plusScore = 0
        this.tlFail.restart()
      }
      this.showResultEffect = true

      if (this.hearts) {
        setTimeout(() => {
          this.onStartClick()
        }, 1000)
      } else { // hearts가 없으면
        if (this.tryNumber > 0) {
          setTimeout(() => {
            this.result = ''
            this.showRetry = true
          }, 1000)
        }
      }
    },
    onStartClick () {
      this.rockColor = 'MistyRose'
      this.paperColor = 'MistyRose'
      this.scissorsColor = 'MistyRose'
      this.showResultEffect = false
      this.result_effect = ''
      this.buttonDisableState = true
      this.tlRockpaperscissors.restart()
    },
    onStartGame () {
      this.initGame()
      this.onStartClick()
      this.showGameStart = false
      this.tryNumber += 1
    },
    onRetryGame () {
      this.initGame()
      this.onStartClick()
      this.showRetry = false
      this.tryNumber += 1
    },
    initGame () {
      this.rockColor = 'MistyRose'
      this.paperColor = 'MistyRose'
      this.scissorsColor = 'MistyRose'
      this.hearts = 3
      this.result = ''
      this.score = 0
      this.curIcon = 'rock'
      this.buttonDisableState = true
      this.showResultEffect = false
      this.cur_combo = -1
      clearInterval(changeHandInterval)
      if (sound2) sound2.stop()
    }
  },
  mounted () {
    this.$refs.audio_rps.addEventListener('ended', () => {
      if (sound2) sound2.stop()
      this.buttonDisableState = false
      this.changeHand()
    }, false)

    this.tlRockpaperscissors = gsap.timeline({ paused: true, onStart: () => { this.onSound2('rps') } })
    this.tlRockpaperscissors.set('.rockpaperscissors', { autoAlpha: 1 })
      .staggerFromTo('.rockpaperscissors .item', 0.3, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.3 })
      .set('.rockpaperscissors', { autoAlpha: 0 })

    this.tlFail = gsap.timeline({ paused: true, onStart: () => { this.onSound2('fail') } })
    this.tlFail.fromTo('.page', { x: 0 }, { x: -10, duration: 0.065 })
      .to('.page', { x: 9, duration: 0.12 })
      .to('.page', { x: -7, duration: 0.15 })
      .to('.page', { x: 6, duration: 0.12 })
      .to('.page', { x: 0, duration: 0.07 })

    this.tlSuccess = gsap.timeline({ paused: true, onStart: () => { this.onSound2('success') }, onComplete: () => { this.tlPlusScore.restart() } })
    this.tlSuccess.fromTo('.page', { scale: 1, autoAlpha: 1 }, { scale: 1.1, autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' }).to('.page', { scale: 1, autoAlpha: 1, duration: 0.2 })

    this.tlPlusScore = gsap.timeline({ paused: true })
    this.tlPlusScore.fromTo('.plusScore', { y: 20, autoAlpha: 1 }, { y: 0, autoAlpha: 0, duration: 1, ease: 'power4.inOut' })
  },
  beforeDestroy () {
    clearInterval(changeHandInterval)
    if (sound2) sound2.stop()
  }
}
</script>

<style lang="scss" scoped>
  .q-page{background:$primary;overflow:hidden;}
  .page{position:absolute;top:0;bottom:0;width:100%;}
  .wrap_box{display: flex;  min-height: 100vh;  flex-direction: column;}
  .wrap_content{flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center;}
  .wrap_header{height:3rem;font-size:1.5rem;}
  .wrap_footer{font-family:sans-serif;height:2rem;font-size:0.8rem;color:MistyRose;text-align:center;}
  .wrap_score{color:MistyRose;font-family: Montserrat-Bold;}
  .wrap_heart{font-size:2rem;}
  .wrap_heart img{display:inline-block;padding-left:5px;}
  .wrap_computer{margin-bottom:3rem;}
  .plusScore{position:absolute;top:calc(50% - 160px);left:calc(50% + 30px);font-family: Montserrat-Bold;font-size:2rem;color:$dark;}
  .wrap_gamestart{width:100%;height:100%;background:$primary;font-size:7rem;}
  .box_gamestart{line-height:0;}
  .wrap_gamestart .title{/* background:MistyRose;color:$primary;padding:10px; *//* margin-bottom:3rem; *//* border-radius:5px;line-height:1; */}
  .wrap_gamestart .start{line-height:1;font-size:3rem;color:$dark;}
@keyframes flash {
    0%,50%,to {opacity: 1}
    25%,75% {opacity: 0}
}
.animate__flash {animation-name: flash;animation-duration:2s;animation-iteration-count: infinite;}
  .wrap_retry{width:100%;height:100%;background:$primary;font-size:3rem;}
  .box_retry{line-height:0;}
  .wrap_retry .retry{line-height:1;font-size:3rem;color:$dark;}
  .wrap_retry .score{background:MistyRose;color:$primary;padding:10px;border-radius:5px;line-height:1;}
  .myrps{font-size:3rem;}
  .wrap_result_effect{position:absolute;font-size:3rem;color:$dark;}
  .rockpaperscissors{position:absolute;font-size:3rem;line-height: 1;color:$dark;}
  @media screen and (max-width: 320px) {
    .wrap_gamestart .title{font-size:5rem;}
    .wrap_gamestart .start{font-size:2rem;}
    .wrap_retry .retry{font-size:2rem;}
    .myrps{font-size:2.5rem;}
  }
</style>
