/**
 * Created by hyc on 2016/12/23.
 */
import React, { Component } from 'react'
import latest from '../data/latest'
import Item from './Item'
import style from './listview.css'
import axios from 'axios'
const Loading = () => (
  <div>Loading ....</div>
)
const Button = ({onClick, children, className}) => (
  <button onClick={onClick} className={className}>{children}</button>
)

const LoadingComponent = (component) => ({isLoading, ...rest}) =>
  isLoading ? <Loading></Loading> : <component {...rest}></component>

const MoreButtn = LoadingComponent(Button)



const today = new Date()
let CURRENTDATE = today.getFullYear() + ''
  + (today.getMonth() + 1)
  , day = today.getDate()
  , BASE_URL = 'https://bird.ioliu.cn/v1/?url=http://news-at.zhihu.com/api/4'
  , PATH_NEWS = '/news'
  , PATH_BEFORE = '/before'
CURRENTDATE += '' + (day > 9 ? day : '0' + day)
class ListView extends Component {
  constructor(props) {
    super(props)

    this.itemClick = this.itemClick.bind(this)
    this.isLoading = false
    this.state = {
      isLoading: false,
      daysdata: [],
      date: null
    }
    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.setLoadMoreTopicData = this.setLoadMoreTopicData.bind(this)
  }

  fetchMoreData(date) {
    this.setState({ isLoading: true })
    const url = `${BASE_URL}${PATH_NEWS}${PATH_BEFORE}/${date}`
    axios.get(url)
      .then(res => {
        this.setLoadMoreTopicData(res.data)
      }).catch(err => {
        //todo
      })
  }

  setLoadMoreTopicData(response) {
    const {daysdata} = this.state
      , {date, stories} = response
    console.info(response)


    if (response.latest) {
      daysdata.push(response.latest)
    } else {
      daysdata.push(response)
      console.info(daysdata)
    }

    this.setState({
      daysdata: daysdata,
      isLoading: false,
      date: date
    })

  }

  componentDidMount() {
    this.fetchMoreData(CURRENTDATE)
  }

  itemClick(event) {

    console.log(event)

  }
  render() {

    const {daysdata, date, isLoading} = this.state
    console.log(this.props)
    return (
      <div className={style.day_container}>
        {
          daysdata && daysdata.map(daydata => (
            <div key={daydata.date}>
              <h2>{daydata.date}</h2>
              <div className={style.stories_container}>
                {
                  daydata.stories.map(story =>
                    <Item story={story} key={story.id}
                      itemClick={() => this.itemClick(story)}>
                    </Item>
                  )
                }
              </div>
            </div>
          ))
        }
        <MoreButtn isLoading={isLoading}
          onClick={() => this.fetchMoreData(date)} >加载更多</MoreButtn>
      </div>
    )
  }
}
ListView.defaultProps = {  }
export default ListView
