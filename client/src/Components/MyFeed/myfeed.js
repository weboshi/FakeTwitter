import React, { Component } from 'react'
import axios from 'axios';
import { UPDATEPROFILE } from '../../Redux/actions/index';
import { Card, CardGroup, ListGroup, ListGroupItem, Button, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import './myfeed.css';

const mapDispatchToProps = dispatch => {
    return {
            UPDATEPROFILE: updatedInfo => dispatch(UPDATEPROFILE(updatedInfo))
    };
  };

  const mapStateToProps = (state) => {
    return { user: state.user};
  };


class FeedComponent extends Component { 
    constructor(props){
        super(props);
        this.state = {
            panel: 1,
            card: 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this.mapJobsAsPanels = this.mapJobsAsPanels.bind(this)
        this.mapJobsAsCards = this.mapJobsAsCards.bind(this)
        this.switchToCard = this.switchToCard.bind(this)
        this.switchToPanel = this.switchToPanel.bind(this)
        this.formatDate = this.formatDate.bind(this)

    }

    // componentDidMount() {
    //     console.log(this.props.user.username)
    //     axios({
    //         method: 'get',
    //         url: `/api/job/getJobs/`,
    //     }).then(res => {
            
    //         this.setState({
    //             jobs: [res.data]
    //         })
    //     }).catch(
    //         err => console.log(err)
    //     )
    // }

        componentDidMount() {
            axios({
                method: 'get',
                url: `api/user/profile/${this.props.user.username}`,
            }).then(res => {
                const userFollows = res.data.following
                axios.get(`/api/job/getFollowPosts/`, {
                    params: {
                        bookmarks: userFollows
                    }
                }).then(res => {
                    console.log(res.data)
                    this.setState({
                        bookmarks: res.data
                    })
                }
                    ).catch(
                        err => console.log(err)
                    )
            })
        }

    addBookmark(jobId) {
        console.log('job id' + jobId)
        var username = this.props.user.username
        axios({
            data: {
                bookmark: jobId,
            },
            method: 'put',
            url: `/api/user/addbookmark/${username}`,
        }).then(res => {
            if(res.code == 200){
                console.log("Bookmarked")
            }
        }).catch(
            err => console.log(err))
    }

    handleChange(e) {
        let name = e.target.name
        let value = e.target.value
    
        this.setState({
        [name]: value
        }, () => { console.log(this.state)});
    }

    formatDate(date) {
        var formattedDate = DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT)
        return formattedDate
    }

    mapJobsAsPanels() {
        const myJobs = this.state.bookmarks
        return (
            myJobs.map((job, i) => 
            <div className="jobs-panel" key={i}>
                <span className='format-date'>{this.formatDate(job.createdAt)}</span>
                <a href={'/listing/' + job.id}>{job.posting}</a>
            </div>
            )
        )
    }

    mapJobsAsCards() {
        const myJobs = this.state.jobs[0]
        return (
            myJobs.map((job, i) => 
            <div className="jobs-card" key={i}>
                <Card>
                    <Card.Body>
                        <Card.Title>{job.title}</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                    <ListGroupItem>{job.description}</ListGroupItem>
                    <ListGroupItem>{job.price}</ListGroupItem>
                    <ListGroupItem>{job.languageFrom}</ListGroupItem>
                    <ListGroupItem>{job.languageTo}</ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        <Card.Link href="#">Read More</Card.Link>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">Posted {job.createdAt}</small>
                    </Card.Footer>
                </Card>
            </div>
            )
        )
    }

    switchToCard() {
        this.setState({
            panel: 0,
            card: 1
        }, () => console.log(this.state))
    }

    switchToPanel() {
        this.setState({
            panel: 1,
            card: 0
        }, () => console.log(this.state))
    }

    render(){
        return(
            <div className='jobs-container'>
                <div className='jobs-component'>
                    <div className='jobs-label'>
                        <h3 className='jobs-header'>My Feed</h3>
                    </div>
                        {this.state.bookmarks && this.state.panel == true && this.mapJobsAsPanels()}
                        {!this.state.bookmarks && <div>Loading Jobs</div>}
                </div>
            </div>
        )
    }
}

export const MyFeed =  connect(mapStateToProps, mapDispatchToProps)(FeedComponent)