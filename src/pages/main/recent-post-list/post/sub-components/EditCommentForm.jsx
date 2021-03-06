import React from 'react';
import Button from 'components/button/Button';
import ButtonUploadImage, {insertImage} from 'components/button/ButtonUploadImage';

import store from 'store/Store';

import fixPostOrComment from 'util/fixPostOrComment';
import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';

export default class EditCommentForm extends React.Component {

    state = {
        content: '',
        submitting: false
    }

    componentWillMount() {
        this.setState({
            content: this.props.originalComment.content
        });
    }

    onCommentChange = (event) => {
        this.setState({
            content: fixPostOrComment(event.target.value)
        });
    }

    onSubmitCommentSuccess = () => {
        this.props.onEditComplete();
    }

    onSubmitComment = () => {
        if (this.state.submitting) {
            return;
        }
        if (!store.currentUser.id) {
            return;
        }

        this.setState({ submitting: true });

        const {originalComment} = this.props;

        const updatedComment = {
            edited: TIMESTAMP,
            content: this.state.content
        };

        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).child(originalComment.id).update(updatedComment, this.onSubmitCommentSuccess);
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
            <form className="edit-comment-form">
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
                    <Button className="button-submit-changes" onClick={this.onSubmitComment}>
                        Submit changes
                    </Button>
                    <Button className="button-cancel" onClick={this.props.onEditComplete}>
                        Cancel
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
