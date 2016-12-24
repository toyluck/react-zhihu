import React, { Component } from 'react'
import style from './App.css'
// import HeaderBar from './components/HeaderBar.js'
// import ListView from './components/ListView.js'
// <ListView/>
import { sortBy } from 'lodash'

const DEFAULT_QUERY = 'redux'
const DEFAULT_PAGE = 0
const DEFAULT_HPP = '100'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

const isSearched = query => item => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: DEFAULT_QUERY,
      isLoading:false,
      sortKey: 'NONE'
  }
 
    this.onSearchChange = this.onSearchChange.bind(this)
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this)
    this.setSearchTopstories = this.setSearchTopstories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this)
    this.sort=this.sort.bind(this)
  }

  setSearchTopstories (stories) {

    //
    const {hits, page} = stories
      ,{searchKey}=this.state  
      , oldHits = page === 0 ? [] : this.state.results[searchKey].hits
      , updateHits = [...oldHits, ...hits]
    
    this.setState({
      results: {
        ...this.state.results, [searchKey]: { hits: updateHits, page }
       } , isLoading:false
    })
  }
  sort(obj) { 
    let key = this.state.sortKey
    key = key === obj.key ?'none':obj.key
    this.setState({sortKey:key})
  }
  onSearchSubmit (event) {
    const {query} = this.state
    this.setState({ searchKey: query })
    if(this.needsToSearchTopstories(query))    
      this.fetchSearchTopstories(query, DEFAULT_PAGE)
    event.preventDefault()
  }
  needsToSearchTopstories(query) {
  return !this.state.results[query]
}

  fetchSearchTopstories(query, page) {
    this.setState({isLoading:true})
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}`)
      .then(res => res.json())
      .then(result => this.setSearchTopstories(result))

  }

  onSearchChange (event) {
    this.setState({query: event.target.value})
  }

  componentDidMount () {
    this.fetchSearchTopstories(DEFAULT_QUERY, DEFAULT_PAGE)
  }
  render () {
    const {query, searchKey, results,isLoading,sortKey} = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
      , list = (results && results[searchKey] && results[searchKey].hits) || []
    console.info(list)
    return (
      <div className={style.page}>
        <div className={style.interactions}>
          <Search value={query}
            onConfirm={this.onSearchSubmit}
            onChange={this.onSearchChange}>
            Search
          </Search>
          {results && <Table query={query} list={list} sortKey={sortKey}
              onClick={this.sort}
            />}
        </div>
        {isLoading+""}
        <ButtonWithLoading isLoading={isLoading}
          onClick={() => this.fetchSearchTopstories(searchKey,page + 1)} >
       加载更多...
        </ButtonWithLoading>
       
      </div>
    )
  }
}
const withLoading = (Component) => ({isLoading, ...rest}) =>
                  isLoading?<Loading/>:<Component {...rest}/>  
const Loading=()=><div>Loading------------</div>
const Button = ({onClick,className, children}) => <button className={className} onClick={onClick}>
                                          {children}
                                        </button>
const ButtonWithLoading=withLoading(Button)
function Search ({value, onChange, onConfirm, children}) {
  return ( <form>
             {children}
             <input type='text' onChange={onChange} value={value} />
             <button onClick={onConfirm}>
               QUERY
             </button>
           </form>)
}
const SortBtn = ({onClick,children,className}) => 
  <Button onClick={onClick} >
    <span className={className}></span>  {children}
  </Button>


const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  NUM_COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS:list=>sortBy(list,'points').reverse()
}
function Table({query, list,sortKey,onClick}) { 
  
  let  keys = ['title', 'author', 'num_comments', 'points']
  sortKey = keys.indexOf(sortKey) > -1 ? sortKey : 'none'
  
  console.log(sortKey.toUpperCase())
  return (
    <div className={style.page}>
      {keys.map(key => <SortBtn key={key}
        onClick={() => onClick({ key })}
        className={(sortKey===key?style.selected:style.table_title)}
        >{key}</SortBtn>)}
      {
        SORTS[sortKey.toUpperCase()](list).filter(isSearched(query))
         .map((item) => <div key={item.objectID} className={style.table_row}>
                          <span className={style.width40}><a href={item.url}>{item.title}</a></span>
                          <span className={style.width30}>{item.author}</span>
                          <span className={style.width15}>{item.num_comments}</span>
                          <span className={style.width15}>{item.points}</span>
                        </div>
       )}
    </div>
  )
}

export default App
