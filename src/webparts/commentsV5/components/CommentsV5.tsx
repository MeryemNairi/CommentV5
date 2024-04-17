import * as React from 'react';
import { Stack } from '@fluentui/react';
import CommentService, { IComment } from './services/CommentService';
import styles from './CommentsV5.module.scss';

export interface ICommentV1Props {
  description: string;
}

export interface ICommentV1State {
  newComment: string;
  comments: IComment[];
}

export default class CommentV1 extends React.Component<{}, ICommentV1State> {
  private commentService: CommentService;

  constructor(props: {}) {
    super(props);
    this.state = {
      newComment: '',
      comments: [],
    };
    this.commentService = new CommentService();
  }

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = async () => {
    try {
      const comments = await this.commentService.getComments();
      this.setState({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newComment: event.target.value });
  };

  handleSubmit = async () => {
    const { newComment } = this.state;
    if (!newComment) return;

    try {
      await this.commentService.postComment(newComment);
      this.fetchComments();
      this.setState({ newComment: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  render() {
    const { newComment, comments } = this.state;
    return (
      <Stack className={`container mt-5 ${styles.container}`}>
        <h2 className={styles.commentTitle}>Vous travaillez chez Cnexia ? Partagez votre expérience !</h2>
        <div className={`coment-bottom bg-white p-2 px-4 ${styles.commentButton}`}>
          <div className={`d-flex flex-row align-items-center ${styles.addCommentSection}`}>

            <input type="text" className={`form-control ${styles.commentInput}`} placeholder="Commencez votre évaluation..." value={newComment} onChange={this.handleCommentChange} />
            <div style={{ marginBottom: '20px' }}></div>
            <button className={`btn btn-primary ${styles.commentButton}`} type="button" onClick={this.handleSubmit}>Comment</button>
          </div>
        </div>
        <div className={`row d-flex justify-content-center align-items-center ${styles.row}`}>
          <div className="col-md-8">
          <h2 className={styles.commentTitle}>Tous les commentaires :</h2>
          <div style={{ marginBottom: '20px' }}></div>
            {comments.map((comment, index) => (
              <div key={index} className={`card p-3 ${styles.card}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className={`user d-flex flex-row align-items-center ${styles.user}`}>
                    <span>
                      <small className={`font-weight-bold text-primary ${styles.userName}`}>{comment.User}</small>
                      &nbsp;<span className={styles.colon}>:</span>&nbsp;
                      <small className={`font-weight-bold ${styles.commentText}`}>{comment.comment}</small>
                    </span>
                  </div>
                  <small className={styles.commentDate}>{comment.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

      </Stack>
    );
  }
}
