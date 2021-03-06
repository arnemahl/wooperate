import React from 'react';
import Post from './post/Post';

import './RecentPostList.scss';

import {FIREBASE_REF} from 'MyFirebase';

export default class RecentPostList extends React.Component {

    state = {
        posts: []
    }

    componentWillMount() {
        FIREBASE_REF.child('posts').orderByChild('lastActivity').limitToLast(20).on('value', this.receivePosts);
    }

    receivePosts = (snap) => {
        const posts = snap.val();
        const postsArray = Object.keys(posts).map(id => {
            return { id, ...posts[id] };
        }).sort((one, two) => (two.lastActivity || 0) - (one.lastActivity || 0));

        this.setState({ posts: postsArray });
    }

    render() {
        return (
            <div className="recent-post-list">
                {this.state.posts.map(post =>
                    <Post key={post.id} post={post} />
                )}
            </div>
        );
    }
}
