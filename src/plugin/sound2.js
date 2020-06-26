export default class Sound2 {
  constructor (context, audioElement) {
    this.audioCtx = context
    this.audioElement = audioElement
  }

  play () {
    // check if context is in suspended state (autoplay policy)
    if (this.audioCtx.state === 'suspended') { // state : suspended(중지), running(실행중), closed(닫힘)
      this.audioCtx.resume() // resume()(실행), suspend()(중지) 로 context 상태를 변경할 수 있다
    }
    this.audioElement.play()
  }

  stop () {
    this.audioElement.pause()
  }
}
// 참고 : https://codepen.io/Rumyra/pen/qyMzqN/?editors=1010
// 참고 : https://medium.com/@pks2974/web-audio-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-952a19d6aa45
