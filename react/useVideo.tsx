import type { RefObject } from 'react'
import { useState, useEffect } from 'react'

interface State {
  isMuted: boolean | null
  isPlaying: boolean | null
  networkStatus: string | null
  volume: number | undefined
}

const NETWORK_STATUS: string[] = [
  'NETWORK_EMPTY',
  'NETWORK_IDLE',
  'NETWORK_LOADING',
  'NETWORK_NO_SOURCE',
]

const useVideo = (
  videoRef: RefObject<HTMLVideoElement>,
  containerRef: RefObject<HTMLDivElement>
) => {
  const currentVideoRef = videoRef?.current
  const currentContainerRef = containerRef?.current
  const [state, setState] = useState<State>({
    isMuted: null,
    isPlaying: null,
    volume: undefined,
    networkStatus: null,
  })

  const play = () => {
    currentVideoRef?.play()

    setState({ ...state, isPlaying: currentVideoRef?.paused === false })
  }

  const pause = () => {
    currentVideoRef?.pause()

    if (currentVideoRef?.autoplay) currentVideoRef.autoplay = false

    setState({ ...state, isPlaying: currentVideoRef?.paused === false })
  }

  const setVolume = (volume: number) => {
    if (!currentVideoRef) return

    if (volume < 0 || volume > 1) return

    currentVideoRef.volume = volume

    setState({ ...state, volume })
  }

  const toggleMute = () => {
    if (!currentVideoRef) return

    currentVideoRef.muted = !currentVideoRef.muted

    setState({ ...state, isMuted: currentVideoRef.muted })
  }

  const toggleFullscreenMode = () => {
    if (document.fullscreenElement) {
      return document.exitFullscreen()
    }

    return currentContainerRef?.requestFullscreen()
  }

  const changeState = (property: string, value: unknown) => {
    setState({ ...state, [property]: value })
  }

  const setNetworkStatus = (networkStatus: string): void => {
    setState({ ...state, networkStatus })
  }

  const getNetworkStatus = (): string => {
    return NETWORK_STATUS[currentVideoRef?.networkState ?? 0]
  }

  const handleEnd = () => {
    setState({ ...state, isPlaying: false })
  }

  useEffect(() => {
    currentVideoRef?.addEventListener('ended', handleEnd)

    setState({
      ...state,
      isMuted: currentVideoRef?.muted === true,
      isPlaying:
        Boolean(currentVideoRef?.autoplay) || currentVideoRef?.paused === false,
      networkStatus: getNetworkStatus(),
    })

    return () => {
      currentVideoRef?.removeEventListener('ended', handleEnd)
    }
    // Disabling because it is necessary to set some default values only when video ref is available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoRef])

  return {
    isPlaying: state.isPlaying,
    isMuted: state.isMuted,
    volume: state.volume,
    networkStatus: state.networkStatus,
    hasEnded: currentVideoRef?.ended,
    play,
    pause,
    setVolume,
    setNetworkStatus,
    toggleMute,
    toggleFullscreenMode,
    changeState,
  }
}

export default useVideo
