import React from 'react';
import Button from 'components/button/Button';
import ButtonUploadImage, {insertImage} from 'components/button/ButtonUploadImage';

import store from 'store/Store';

import fixPostOrComment from 'util/fixPostOrComment';
import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';

export default class NewCommentForm extends React.Component {

    state = {
        content: '',
        submitting: false
    }

    onCommentChange = (event) => {
        this.setState({
            content: fixPostOrComment(event.target.value)
        });
    }

    onSubmitCommentSuccess = () => {
        this.setState({
            submitting: false,
            content: ''
        });
    }

    onSubmitComment = () => {
        if (this.state.submitting) {
            return;
        }
        if (!store.currentUser.id) {
            return;
        }
        if (!this.state.content.replace(/\s/g, '').replace(/\n/g, '')) {
            return;
        }

        this.setState({ submitting: true });

        const comment = {
            timestamp: TIMESTAMP,
            content: this.state.content,
            author: store.currentUser.id
        };

        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).push(comment, this.onSubmitCommentSuccess);
        FIREBASE_REF.child('posts').child(post.id).child('lastActivity').set(TIMESTAMP);
    }

    onImageUploadComplete = (url) => {
        const cursorPos = this.refs.textarea.selectionStart;

        this.setState({
            content: insertImage(this.state.content, url, cursorPos)
        });
    }

    render() {
        return (
            <form className="comment-form">
                <textarea
                    ref="textarea"
                    value={this.state.content}
                    onChange={this.onCommentChange}
                    placeholder="Write a comment"
                    />

                <span className="buttons">
                    <ButtonUploadImage className="button-add-image-from-disk" onImageUploadComplete={this.onImageUploadComplete}>
                        Add image from disk
                    </ButtonUploadImage>

                    <Button className="button-submit-comment" onClick={this.onSubmitComment}>
                        Submit comment
                    </Button>
                </span>

                {this.state.submitting &&
                    <div className="feedback">
                        Please wait...
                    </div>
                }
            </form>
        );
    }
}
