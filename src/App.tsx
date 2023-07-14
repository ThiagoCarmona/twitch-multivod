import './App.css'
import { Pane, Textarea, Button, TextInput } from 'evergreen-ui'
import UseAnimations from "react-useanimations";
import loadingIcon from 'react-useanimations/lib/loading'
import React, {useEffect} from 'react'
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { getSyncVods } from './api/api';

function App() {

  const [channelList, setChannelList] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [vodUrl, setVodUrl] = React.useState<string>('')
  const [vodId, setVodId] = React.useState<string>('')
  const [vodOk, setVodOk] = React.useState<boolean>(true)
  const [multiVodUrl, setMultiVodUrl] = React.useState<string>('')

  const timeFormat = 'HH:mm'
  const [time, setTime] = React.useState<any>(dayjs('00:00', timeFormat))

  useEffect(() => {
    const channelList = window.localStorage.getItem('channelList')
    if (channelList) {
      setChannelList(JSON.parse(channelList))
    }
  }, [])

  const handleMultiVodUrlClick = () => {
    //open url in new tab
    console.log(multiVodUrl)
    if(multiVodUrl === '') return
    window.open(multiVodUrl, '_blank')
  }

  const handleTimeChange = (time: any) => {
    setTime(time)
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
      
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="App">
      <Pane>
        <h2>Vod</h2>
        <TextInput
        id="vod-url"
        placeholder="Enter Vod URL or ID"
        onChange={handleVodUrl}
        value={vodUrl}
        style={
          vodOk ? {} : {backgroundColor: "#e27676"}
        }
        />
        <TimePicker defaultValue={dayjs('00:00', timeFormat)} format={timeFormat} showNow={false} value={time} onChange={handleTimeChange}/>
        <h2>Channel List</h2>
        <Textarea
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
        <h2>MultiVod URL</h2>
        <TextInput
        placeholder="MultiVod URL"
        value={multiVodUrl}
        id="multi-vod-url"
        onClick={handleMultiVodUrlClick}
        />
      </Pane>
    </div>
  )
}

export default App
