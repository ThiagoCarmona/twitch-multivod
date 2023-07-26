import "./liveInfo.css"

interface LiveInfoProps {
  title: string
  channelName: string
  date: string
  profilePic: string
  show?: boolean
}

export const LiveInfo = (props: LiveInfoProps) => {
  return (
    <div className={`liveInfo ${props.show === true ? '' : 'hide'}`}>
      <div className="liveInfo__left">
        <img src={props.profilePic} />
      </div>
      <div className="liveInfo__right">
        <p className="liveInfo__right__title">{props.title}</p>
        <div className="liveInfo__right__bottom">
          <p className="channel-name">{props.channelName}</p>
          <p className="date">{props.date}</p>
        </div>
      </div>
    </div>
  )
}