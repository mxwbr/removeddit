import React from 'react'
import { getRemovedThreadIDs } from 'api/removeddit'
import { getThreads } from 'api/reddit'
import Post from 'components/Post'

const displaySubreddit = props => {
  const subreddit = props.match.params.subreddit
  if (subreddit === undefined) {
    return 'all'
  }
  return subreddit
}

const getSubredditForAPI = props => {
  const subreddit = props.match.params.subreddit
  if (subreddit === undefined) {
    return ''
  } else if (subreddit.toLowerCase() === 'all') {
    return ''
  }
  return subreddit.toLowerCase()
}


export default class Subreddit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      threads: [],
    }
  }

  componentDidMount() {
    const subreddit = getSubredditForAPI(this.props)
    getRemovedThreadIDs(subreddit)
      .then(threadIDs => getThreads(threadIDs))
      .then(threads => {
        threads.forEach(thread => {
          thread.removed = true
          thread.selftext = ''
        })
        this.setState({ threads })
      })
  }

  render() {
    const subreddit = `/r/${displaySubreddit(this.props)}`

    return (
      <React.Fragment>
        <div className='subreddit-box'>
          <a href={subreddit} className='subreddit-title'>{subreddit}</a>
          <span className='space' />
          <a href={`https://www.reddit.com${subreddit}`} className='subreddit-title-link'>reddit</a>
          <span className='space' />
          <a href={`https://snew.github.io${subreddit}`} className='subreddit-title-link'>ceddit</a>
        </div>
        {
        this.state.threads.map(thread => (
          <Post key={thread.id} {...thread} />
        ))
        }
      </React.Fragment>
    )
  }
}