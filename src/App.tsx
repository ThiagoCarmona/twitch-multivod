import './App.css'
import { Pane, Textarea, Button, TextInput } from 'evergreen-ui'
import UseAnimations from "react-useanimations";
import loadingIcon from 'react-useanimations/lib/loading'
import React, {useEffect, useRef} from 'react'
import { TimePicker, Tour, TourProps, message } from 'antd';
import dayjs from 'dayjs';
import { getSyncVods } from './api/api';

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const [channelList, setChannelList] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [vodUrl, setVodUrl] = React.useState<string>('')
  const [vodId, setVodId] = React.useState<string>('')
  const [vodOk, setVodOk] = React.useState<boolean>(true)
  const [multiVodUrl, setMultiVodUrl] = React.useState<string>('')
  const [twitchVodSyncUrl, setTwitchVodSyncUrl] = React.useState<string>('')
  const [tourOpen, setTourOpen] = React.useState<boolean>(false)

  const timeFormat = 'HH:mm'
  const [time, setTime] = React.useState<any>(dayjs('00:00', timeFormat))

  const VodUrlRef = useRef(null)
  const timerRef = useRef(null)
  const channelListRef = useRef(null)
  const multiVodUrlRef = useRef(null)
  const twitchVodSyncUrlRef = useRef(null)

  useEffect(() => {
    const tour = window.localStorage.getItem('tour')
    if (!tour) {
      setTourOpen(true)
    }
  }, [])

  const steps: TourProps['steps'] = [
    {
      title: 'Vod URL',
      description: 'Enter the Vod URL or ID',
      target: () => VodUrlRef.current,
      
    },
    {
      title: 'Time',
      description: 'Enter the time to start the Vod',
      target: () => timerRef.current,
    },
    {
      title: 'Channel List',
      description: 'Enter the channels to sync',
      target: () => channelListRef.current,
    },
    {
      title: 'MultiVod URL',
      description: 'The MultiVod URL will appear here',
      target: () => multiVodUrlRef.current,
    },
    {
      title: 'TwitchVodSync URL',
      description: 'The TwitchVodSync URL will appear here',
      target: () => twitchVodSyncUrlRef.current,
    },
  ]

  useEffect(() => {
    const channelList = window.localStorage.getItem('channelList')
    if (channelList) {
      setChannelList(JSON.parse(channelList))
    }
  }, [])

  const handleMultiVodUrlClick = () => {
    if(multiVodUrl === '') return
    window.open(multiVodUrl, '_blank')
  }

  const handleTwitchVodSyncUrlClick = () => {
    if(twitchVodSyncUrl === '') return
    window.open(twitchVodSyncUrl, '_blank')
  }

  const handleTimeChange = (time: any) => {
    setTime(time)
  }

  const setTour = () => {
    window.localStorage.setItem('tour', 'true')
    setTourOpen(false)
  }

  const handleChannelList = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const channelList = ev.target.value.split('\n')
    .map((channel) => channel.trim())
    setChannelList(channelList)
    window.localStorage.setItem('channelList', JSON.stringify(channelList))
  }

  const handleVodUrl = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const vodUrl = ev.target.value
    const vodUrlRegex = /https:\/\/www\.twitch\.tv\/videos\/(\d{10})/
    setVodUrl(vodUrl)
    
    if (vodUrlRegex.test(vodUrl)) {
      //get vod id group from regex
      var vodId = vodUrl.match(vodUrlRegex)![1]
    } else if (vodUrl.length === 10) {
      var vodId = vodUrl
    } else {
      return
    }

    if (vodId) {
      setVodId(vodId)
      console.log(vodId)
    }

  }

  const handleButtonClick = () => {
    if(loading) return
    messageApi.open({
      content: 'Fetching Vods...',
      key: 'loading',
      type: 'loading',
      duration: 0,
    });
    setLoading(true)
    if(!vodId) {
      setLoading(false)
      setVodOk(false)
      return
    }
    setVodOk(true)
    //get minutes sum
    const minutes = time.hour() * 60 + time.minute()
    console.log(minutes)
    getSyncVods(vodId, channelList, minutes).then((res) => {
      setMultiVodUrl(res.multiVodUrl || '')
      setTwitchVodSyncUrl(res.twitchVodSyncUrl || '')
      
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
      messageApi.destroy('loading')
    })
  }

  return (
    <div className="App">
      {contextHolder}
      <Tour
      steps={steps}
      onFinish={setTour}
      open={tourOpen}
      />
      <Pane>
        <h2>Vod</h2>
        <TextInput
        ref={VodUrlRef}
        id="vod-url"
        placeholder="Enter Vod URL or ID"
        onChange={handleVodUrl}
        value={vodUrl}
        style={
          vodOk ? {} : {backgroundColor: "#e27676"}
        }
        />
        <div ref={timerRef} style={{display: 'inline-block', margin: '0 10px'
        }}>
        <TimePicker defaultValue={dayjs('00:00', timeFormat)} format={timeFormat} showNow={false} value={time} onChange={handleTimeChange}/>
        </div>
        <h2>Channel List</h2>
        <Textarea
        ref={channelListRef}
        id="channel-area"
        placeholder="Enter each channel on one line"
        onChange={handleChannelList}
        value={channelList.join('\n')}
        />
      </Pane>
      <Button
      id="submit-button"
      onClick={handleButtonClick}
      >
        {
          (loading) ? (
            <UseAnimations
            animation={loadingIcon}
            size={20}
            />
          ) : (
            'Submit'
          )
        }
      </Button>
      <Pane
      id='output-area'
      > 
        <h2>TwitchVodSync URL</h2>
        <TextInput
        placeholder="TwitchVodSync URL"
        value={twitchVodSyncUrl}
        id="multi-vod-url"
        onClick={handleTwitchVodSyncUrlClick}
        ref={twitchVodSyncUrlRef}
        />

        <h2>MultiVod URL</h2>
        <TextInput
        placeholder="MultiVod URL"
        value={multiVodUrl}
        id="multi-vod-url"
        onClick={handleMultiVodUrlClick}
        ref={multiVodUrlRef}
        />
      </Pane>
    </div>
  )
}

export default App
